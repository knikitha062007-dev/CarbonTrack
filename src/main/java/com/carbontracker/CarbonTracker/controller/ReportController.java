package com.carbontracker.CarbonTracker.controller;

import com.carbontracker.CarbonTracker.service.PdfReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.carbontracker.CarbonTracker.service.EmailService;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.carbontracker.CarbonTracker.service.ExcelReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private PdfReportService pdfReportService;
    @Autowired
    private ExcelReportService excelReportService;
    @Autowired
    private EmailService emailService;

    @GetMapping("/pdf/{userId}")
    public ResponseEntity<byte[]> generateReport(
            @PathVariable Long userId,
            @RequestParam String from,
            @RequestParam String to) {

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        byte[] pdf = pdfReportService.generateReport(userId, fromDate, toDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=CarbonTrack_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
    @GetMapping("/excel/{userId}")
    public ResponseEntity<byte[]> generateExcelReport(
            @PathVariable Long userId,
            @RequestParam String from,
            @RequestParam String to) {

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        byte[] excel = excelReportService.generateExcelReport(userId, fromDate, toDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=CarbonTrack_Report.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
    @PostMapping("/email/{userId}")
    public ResponseEntity<String> sendReportByEmail(
            @PathVariable Long userId,
            @RequestParam String email,
            @RequestParam String from,
            @RequestParam String to) {

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        byte[] pdf = pdfReportService.generateReport(userId, fromDate, toDate);
        byte[] excel = excelReportService.generateExcelReport(userId, fromDate, toDate);

        emailService.sendReport(
                email,
                pdf,
                excel
        );

        return ResponseEntity.ok("Report sent successfully to " + email);
    }
}
