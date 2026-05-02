package com.inspector.platform.service.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import io.netty.resolver.DefaultAddressResolverGroup;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.base-url}")
    private String baseUrl;

    private final WebClient.Builder webClientBuilder;

    /**
     * Generates a quiz with exactly 10 questions (MCQ + Free Text) based on topic and subject.
     */
    public String generateQuizContent(String topic, String subject) {
        String prompt = "Generate a pedagogical quiz for " + subject + " teachers on the topic: " + topic + ".\n" +
                "Requirements:\n" +
                "1. Include EXACTLY 10 questions. No more, no less.\n" +
                "2. 7 questions must be Multiple Choice (MCQ) with 4 options each.\n" +
                "3. 3 questions must be Open-ended (FREE_TEXT).\n" +
                "4. Return ONLY a valid JSON array of objects. Each object must have: \n" +
                "   - 'text': the question text\n" +
                "   - 'type': either 'MCQ' or 'FREE_TEXT'\n" +
                "   - 'options': (for MCQ only) an array of 4 strings\n" +
                "   - 'correctAnswer': (for MCQ) the exact string of the correct option; (for FREE_TEXT) a brief model answer describing what a perfect response should contain.\n" +
                "Do not include any conversation or markdown formatting. Just the raw JSON array.";

        return callGemini(prompt).block();
    }

    /**
     * Evaluates teacher's answers and returns a score, evaluation, and training suggestion.
     * Score is out of 20. Each of 10 questions is worth 2 points.
     */
    public String evaluateSubmission(String quizContext, String answers) {
        String prompt = "You are an educational expert evaluating a teacher's quiz submission. Score based on strict rules.\n" +
                "SCORING RULES:\n" +
                "- There are exactly 10 questions. Total score = 20 points.\n" +
                "- Each question is worth 2 points.\n" +
                "- For MCQ questions: award 2 points if the teacher's answer EXACTLY matches the correct answer key (case-insensitive). Award 0 otherwise.\n" +
                "- For FREE_TEXT questions: award 2 points if the answer is complete and accurate, 1 point if partially correct, 0 if wrong or missing.\n" +
                "- Sum all points. A perfect score (all correct) MUST be 20.\n" +
                "\nQuiz Questions with Correct Answers:\n" + quizContext + "\n" +
                "\nTeacher's Submitted Answers (format: questionId -> answer):\n" + answers + "\n" +
                "\nTask:\n" +
                "1. For EACH question, compare teacher's answer to the correct key.\n" +
                "2. Calculate the total score by summing all question scores.\n" +
                "3. Write a professional evaluation of the teacher's performance.\n" +
                "4. If score < 20, suggest a specific professional training program or topic to improve.\n" +
                "\nReturn ONLY a valid JSON object with these exact fields:\n" +
                "   - 'score': (integer 0-20, calculated exactly per the rules above)\n" +
                "   - 'evaluation': (string, professional feedback)\n" +
                "   - 'trainingSuggestion': (string, if score is 20 write 'Excellent performance - no additional training required.')\n" +
                "Do not include any markdown formatting or extra text. Just the raw JSON object.";

        return callGemini(prompt).block();
    }

    private Mono<String> callGemini(String prompt) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
        WebClient client = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

        // Gemini API request structure
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        return client.post()
                .uri(baseUrl)
                .header("Content-Type", "application/json")
                .header("X-goog-api-key", apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .doOnError(e -> log.error("Gemini API Call failed: {}", e.getMessage()))
                .map(response -> {
                    try {
                        List<Map> candidates = (List<Map>) response.get("candidates");
                        if (candidates == null || candidates.isEmpty()) {
                            log.error("No candidates in Gemini response: {}", response);
                            throw new RuntimeException("AI returned no results");
                        }
                        Map firstCandidate = candidates.get(0);
                        Map content = (Map) firstCandidate.get("content");
                        List<Map> parts = (List<Map>) content.get("parts");
                        String text = (String) parts.get(0).get("text");
                        return text.replaceAll("```json", "").replaceAll("```", "").trim();
                    } catch (Exception e) {
                        log.error("Error parsing Gemini response: {}", response, e);
                        throw new RuntimeException("Failed to interpret AI response");
                    }
                });
    }
}
