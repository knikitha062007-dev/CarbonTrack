package com.carbontracker.CarbonTracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendReport(String toEmail,
                           byte[] pdfReport,
                           byte[] excelReport)
    {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("CarbonTrack Sustainability Report");
            helper.setText("Please find your sustainability report attached.");

            helper.addAttachment(
                    "CarbonTrack_Report.pdf",
                    new ByteArrayResource(pdfReport));

            helper.addAttachment(
                    "CarbonTrack_Report.xlsx",
                    new ByteArrayResource(excelReport));

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}