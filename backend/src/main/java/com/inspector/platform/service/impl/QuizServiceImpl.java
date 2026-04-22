package com.inspector.platform.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inspector.platform.dto.QuizResponse;
import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import com.inspector.platform.service.QuizService;
import com.inspector.platform.service.ai.GeminiService;
import com.inspector.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizSubmissionRepository submissionRepository;
    private final InspectorProfileRepository inspectorRepository;
    private final TeacherProfileRepository teacherRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;
    private final NotificationService notificationService;

    @Override
    public List<Map<String, Object>> generateAIQuestions(String topic, String subject) {
        String json = geminiService.generateQuizContent(topic, subject);
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception e) {
            log.error("Failed to parse AI quiz JSON: {}", json, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "AI generated invalid quiz format");
        }
    }

    @Override
    @Transactional
    public QuizResponse saveQuiz(Long inspectorUserId, String title, String topic, String subject, List<Map<String, Object>> questionData) {
        InspectorProfile inspector = inspectorRepository.findByUserId(inspectorUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inspector profile not found"));

        Quiz quiz = Quiz.builder()
                .title(title)
                .topic(topic)
                .subject(Subject.valueOf(subject.toUpperCase()))
                .inspector(inspector)
                .build();

        List<QuizQuestion> questions = questionData.stream().map(q -> {
            QuizQuestion qq = QuizQuestion.builder()
                    .quiz(quiz)
                    .questionText((String) q.get("text"))
                    .type(QuizQuestion.QuestionType.valueOf((String) q.get("type")))
                    .correctAnswer((String) q.get("correctAnswer"))
                    .build();
            
            if (q.containsKey("options")) {
                try {
                    qq.setOptions(objectMapper.writeValueAsString(q.get("options")));
                } catch (Exception e) {
                    log.error("Error serializing MCQ options", e);
                }
            }
            return qq;
        }).collect(Collectors.toList());

        quiz.setQuestions(questions);
        Quiz saved = quizRepository.save(quiz);

        // Notify all teachers of the same subject
        List<TeacherProfile> matchingTeachers = teacherRepository.findBySubject(Subject.valueOf(subject.toUpperCase()));
        for (TeacherProfile t : matchingTeachers) {
            notificationService.sendNotification(
                t.getUser().getId(),
                "New Quiz Assigned",
                "Inspector " + inspector.getLastName() + " has assigned a new quiz: " + title,
                "QUIZ_ASSIGNED",
                "/teacher/quizzes"
            );
        }

        return mapToResponse(saved, true);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResponse> getAvailableQuizzes(Long teacherUserId) {
        TeacherProfile teacher = teacherRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));

        // Only show quizzes matching the teacher's subject
        return quizRepository.findBySubject(teacher.getSubject()).stream()
                .map(q -> mapToResponse(q, false))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResponse> getInspectorQuizzes(Long inspectorUserId) {
        return quizRepository.findByInspectorUserId(inspectorUserId).stream()
                .map(q -> mapToResponse(q, true))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Map<String, Object> submitQuiz(Long teacherUserId, Long quizId, Map<Long, String> answers) {
        TeacherProfile teacher = teacherRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher profile not found"));
        
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));

        // Check if already submitted
        if (submissionRepository.findByQuizIdAndTeacherUserId(quizId, teacherUserId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Quiz already submitted");
        }

        try {
            String answersJson = objectMapper.writeValueAsString(answers);
            
            // Prepare structured context for Gemini evaluation — one line per question with ID + type + answer key
            String quizContext = quiz.getQuestions().stream()
                    .map(q -> "[Q_ID:" + q.getId() + "][Type:" + q.getType().name() + "] " + q.getQuestionText() + " => CORRECT: " + q.getCorrectAnswer())
                    .collect(Collectors.joining("\n"));

            String evalJson = geminiService.evaluateSubmission(quizContext, answersJson);
            Map<String, Object> eval = objectMapper.readValue(evalJson, new TypeReference<Map<String, Object>>() {});

            QuizSubmission submission = QuizSubmission.builder()
                    .quiz(quiz)
                    .teacher(teacher)
                    .answers(answersJson)
                    .score((Integer) eval.get("score"))
                    .evaluationText((String) eval.get("evaluation"))
                    .trainingSuggestion((String) eval.get("trainingSuggestion"))
                    .build();

            submissionRepository.save(submission);

            // Notify Inspector
            notificationService.sendNotification(
                quiz.getInspector().getUser().getId(),
                "Quiz Submitted",
                "Teacher " + teacher.getFirstName() + " " + teacher.getLastName() + " has submitted the quiz: " + quiz.getTitle() + " (Score: " + eval.get("score") + "/20)",
                "QUIZ_SUBMITTED",
                "/inspector/quizzes"
            );

            return eval;
        } catch (Exception e) {
            log.error("Error evaluating quiz submission", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "AI evaluation failed");
        }
    }

    private QuizResponse mapToResponse(Quiz quiz, boolean includeAnswers) {
        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .subject(quiz.getSubject().name())
                .topic(quiz.getTopic())
                .createdAt(quiz.getCreatedAt().toString())
                .questions(quiz.getQuestions().stream().map(q -> {
                    List<String> options = null;
                    if (q.getOptions() != null) {
                        try {
                            options = objectMapper.readValue(q.getOptions(), new TypeReference<List<String>>() {});
                        } catch (Exception e) {}
                    }
                    return QuizResponse.QuestionDto.builder()
                            .id(q.getId())
                            .text(q.getQuestionText())
                            .type(q.getType())
                            .options(options)
                            .correctAnswer(includeAnswers ? q.getCorrectAnswer() : null)
                            .build();
                }).collect(Collectors.toList()))
                .build();
    }
}
