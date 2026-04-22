package com.inspector.platform.service.impl;

import com.inspector.platform.entity.Activity;
import com.inspector.platform.entity.ActivityReport;
import com.inspector.platform.entity.TeacherProfile;
import com.inspector.platform.repository.ActivityReportRepository;
import com.inspector.platform.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfExportServiceImpl implements PdfExportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final ActivityReportRepository reportRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] exportReport(Long userId, Long reportId, boolean isTeacher) {
        ActivityReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        verifyAccess(userId, report, isTeacher);

        if (report.getImportedPdf() != null && report.getImportedPdf().length > 0) {
            return report.getImportedPdf();
        }

        return buildPdf(report, isTeacher);
    }

    @Override
    @Transactional
    public void importReportPdf(Long inspectorId, Long reportId, String fileName, byte[] content) {
        ActivityReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        verifyAccess(inspectorId, report, false);

        if (content == null || content.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PDF file is empty");
        }

        report.setImportedPdf(content);
        report.setImportedPdfFileName(fileName == null || fileName.isBlank()
                ? "activity-report-" + reportId + ".pdf"
                : fileName);
        reportRepository.save(report);
    }

    @Override
    @Transactional(readOnly = true)
    public String getReportPdfFileName(Long userId, Long reportId, boolean isTeacher) {
        ActivityReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        verifyAccess(userId, report, isTeacher);

        return report.getImportedPdfFileName() == null || report.getImportedPdfFileName().isBlank()
                ? "activity-report-" + reportId + ".pdf"
                : report.getImportedPdfFileName();
    }

    private void verifyAccess(Long userId, ActivityReport report, boolean isTeacher) {
        if (isTeacher) {
            if (report.getTeacher() == null || !report.getTeacher().getUser().getId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This report does not belong to you");
            }
        } else {
            if (!report.getInspector().getId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this report");
            }
        }
    }

    private byte[] buildPdf(ActivityReport report, boolean isTeacher) {
        List<String> lines = buildReportLines(report, isTeacher);
        StringBuilder stream = new StringBuilder();
        stream.append("BT\n");
        stream.append("/F1 16 Tf\n");
        stream.append("50 780 Td\n");
        stream.append("(").append(escapePdf("Inspector Platform - Activity Report")).append(") Tj\n");
        stream.append("/F1 10 Tf\n");
        stream.append("0 -24 Td\n");

        for (String line : lines) {
            stream.append("(").append(escapePdf(line)).append(") Tj\n");
            stream.append("0 -15 Td\n");
        }

        stream.append("ET");
        byte[] streamBytes = stream.toString().getBytes(StandardCharsets.ISO_8859_1);

        List<byte[]> objects = List.of(
                "<< /Type /Catalog /Pages 2 0 R >>".getBytes(StandardCharsets.ISO_8859_1),
                "<< /Type /Pages /Kids [3 0 R] /Count 1 >>".getBytes(StandardCharsets.ISO_8859_1),
                "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>".getBytes(StandardCharsets.ISO_8859_1),
                "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>".getBytes(StandardCharsets.ISO_8859_1),
                ("<< /Length " + streamBytes.length + " >>\nstream\n" + new String(streamBytes, StandardCharsets.ISO_8859_1) + "\nendstream").getBytes(StandardCharsets.ISO_8859_1)
        );

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        write(output, "%PDF-1.4\n");
        List<Integer> offsets = new ArrayList<>();

        for (int i = 0; i < objects.size(); i++) {
            offsets.add(output.size());
            write(output, (i + 1) + " 0 obj\n");
            write(output, objects.get(i));
            write(output, "\nendobj\n");
        }

        int xrefStart = output.size();
        write(output, "xref\n");
        write(output, "0 " + (objects.size() + 1) + "\n");
        write(output, "0000000000 65535 f \n");
        for (Integer offset : offsets) {
            write(output, String.format("%010d 00000 n \n", offset));
        }
        write(output, "trailer\n");
        write(output, "<< /Size " + (objects.size() + 1) + " /Root 1 0 R >>\n");
        write(output, "startxref\n");
        write(output, String.valueOf(xrefStart));
        write(output, "\n%%EOF");

        return output.toByteArray();
    }

    private List<String> buildReportLines(ActivityReport report, boolean isTeacher) {
        Activity activity = report.getActivity();
        TeacherProfile teacher = report.getTeacher();
        String teacherName = teacher == null
                ? "General activity report"
                : teacher.getFirstName() + " " + teacher.getLastName();

        String scoreDisplay = (report.getScore() == null || isTeacher) 
                ? (isTeacher ? "Confidential" : "Not scored") 
                : report.getScore() + "/20";

        return List.of(
                "Report title: " + report.getTitle(),
                "Status: " + report.getStatus(),
                "Score: " + scoreDisplay,
                "Activity: " + activity.getTitle(),
                "Activity type: " + activity.getType(),
                "Activity date: " + activity.getStartDateTime().format(DATE_FORMAT),
                "Location: " + activity.getLocation(),
                "Teacher: " + teacherName,
                "Inspector: " + report.getInspector().getEmail(),
                "",
                "Observations:",
                report.getObservations(),
                "",
                "Recommendations:",
                report.getRecommendations() == null || report.getRecommendations().isBlank()
                        ? "No recommendations added."
                        : report.getRecommendations()
        );
    }

    private String escapePdf(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)")
                .replace("\r", " ")
                .replace("\n", " ");
    }

    private void write(ByteArrayOutputStream output, String value) {
        write(output, value.getBytes(StandardCharsets.ISO_8859_1));
    }

    private void write(ByteArrayOutputStream output, byte[] value) {
        output.write(value, 0, value.length);
    }
}
