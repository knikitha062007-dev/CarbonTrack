package com.carbontracker.CarbonTracker.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import com.carbontracker.CarbonTracker.entity.Activity;
import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class PdfReportService {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserRepository userRepository;

    public byte[] generateReport() {

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            document.add(new Paragraph("CarbonTrack Sustainability Report"));

            document.add(new Paragraph(" "));

            document.add(new Paragraph("User: Priyanka Teli"));

            document.add(new Paragraph("Transport Emission : 220.0 kg CO₂"));

            document.add(new Paragraph("Electricity : 27.6 kg CO₂"));

            document.add(new Paragraph("Food : 85.0 kg CO₂"));

            document.add(new Paragraph("Shopping : 110.0 kg CO₂"));

            document.add(new Paragraph("Total Emission : 442.68 kg CO₂"));

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
      // add this import at the top if it isn't there

    public byte[] generateReport(Long userId,
                                 LocalDate fromDate,
                                 LocalDate toDate) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startDate = fromDate.atStartOfDay();
        LocalDateTime endDate = toDate.atTime(23, 59, 59);

        Double transport = activityRepository.getTransportEmissionBetween(user, startDate, endDate);
        Double electricity = activityRepository.getElectricityEmissionBetween(user, startDate, endDate);
        Double food = activityRepository.getFoodEmissionBetween(user, startDate, endDate);
        Double shopping = activityRepository.getShoppingEmissionBetween(user, startDate, endDate);
        Double total = activityRepository.getTotalEmissionBetween(user, startDate, endDate);

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

// ===== Title =====
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            Paragraph title = new Paragraph("CarbonTrack Sustainability Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Helping You Build a Greener Future", normalFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph(" "));
            addLine(document);

// ===== Report Details =====
            document.add(new Paragraph("Report Details", headingFont));
            String reportId = "CR-" + java.time.LocalDate.now().format(
                    java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")) + "-0001";

            document.add(new Paragraph("Report ID : " + reportId, normalFont));
            String generatedDate = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

            document.add(new Paragraph("Generated On : " + generatedDate, normalFont));
            document.add(new Paragraph("From : " + fromDate, normalFont));
            document.add(new Paragraph("To : " + toDate, normalFont));

            document.add(new Paragraph(" "));
            addLine(document);

// ===== User Information =====
            document.add(new Paragraph("User Information", headingFont));

            PdfPTable userTable = new PdfPTable(2);
            userTable.setWidthPercentage(100);

            userTable.addCell("Name");
            userTable.addCell(user.getFullName());

            userTable.addCell("Email");
            userTable.addCell(user.getEmail());

            userTable.addCell("User ID");
            userTable.addCell(String.valueOf(user.getId()));

            document.add(userTable);

            document.add(new Paragraph(" "));
            addLine(document);

// ===== Emission Summary =====
            document.add(new Paragraph("Carbon Emission Summary", headingFont));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            table.addCell("Category");
            table.addCell("Emission (kg CO₂)");

            table.addCell("Transport");
            table.addCell(String.format("%.2f", transport));

            table.addCell("Electricity");
            table.addCell(String.format("%.2f", electricity));

            table.addCell("Food");
            table.addCell(String.format("%.2f", food));

            table.addCell("Shopping");
            table.addCell(String.format("%.2f", shopping));

            PdfPCell total1 = new PdfPCell(new Phrase("TOTAL", boldFont));
            PdfPCell total2 = new PdfPCell(new Phrase(String.format("%.2f kg CO₂", total), boldFont));

            table.addCell(total1);
            table.addCell(total2);

            document.add(table);

            document.add(new Paragraph(" "));
            addLine(document);

// ===== Status =====
            document.add(new Paragraph("Carbon Footprint Status", headingFont));

            String status;

            if (total < 100)
                status = "★★★★★ Excellent";
            else if (total < 300)
                status = "★★★★☆ Good";
            else if (total < 600)
                status = "★★★☆☆ Average";
            else
                status = "★★☆☆☆ Poor";

            document.add(new Paragraph(status, boldFont));

            document.add(new Paragraph(" "));
            addLine(document);

// ===== Recommendations =====
            document.add(new Paragraph("Recommendations", headingFont));

            document.add(new Paragraph("• Prefer public transportation or carpooling to reduce emissions.", normalFont));
            document.add(new Paragraph("• Switch off electrical appliances when not in use.", normalFont));
            document.add(new Paragraph("• Purchase only necessary items to reduce waste.", normalFont));
            document.add(new Paragraph("• Monitor your carbon footprint regularly using CarbonTrack.", normalFont));
            document.add(new Paragraph("• Choose sustainable and eco-friendly products whenever possible.", normalFont));

            document.add(new Paragraph(" "));
            addLine(document);

// ===== Footer =====
            Paragraph footer = new Paragraph(
                    "Generated Automatically by CarbonTrack\n"
                            + "For informational purposes only.\n"
                            + "© 2026 CarbonTrack",
                    normalFont
            );

            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    private void addLine(Document document) throws DocumentException {
        LineSeparator line = new LineSeparator();
        line.setLineWidth(1f);
        document.add(new Chunk(line));
        document.add(new Paragraph(" "));
    }

}