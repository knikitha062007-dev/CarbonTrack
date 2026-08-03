package com.carbontracker.CarbonTracker.service;

import com.carbontracker.CarbonTracker.entity.User;
import com.carbontracker.CarbonTracker.repository.ActivityRepository;
import com.carbontracker.CarbonTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.IOException;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class ExcelReportService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;
    public byte[] generateExcelReport(Long userId,
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
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Carbon Report");

            int rowNum = 0;

            Row titleRow = sheet.createRow(rowNum++);
            titleRow.createCell(0).setCellValue("CarbonTrack Sustainability Report");

            rowNum++;

            Row userRow = sheet.createRow(rowNum++);
            userRow.createCell(0).setCellValue("User");
            userRow.createCell(1).setCellValue(user.getFullName());

            Row fromRow = sheet.createRow(rowNum++);
            fromRow.createCell(0).setCellValue("From");
            fromRow.createCell(1).setCellValue(fromDate.toString());

            Row toRow = sheet.createRow(rowNum++);
            toRow.createCell(0).setCellValue("To");
            toRow.createCell(1).setCellValue(toDate.toString());

            rowNum++;

            Row header = sheet.createRow(rowNum++);
            header.createCell(0).setCellValue("Category");
            header.createCell(1).setCellValue("Emission (kg CO2)");

            Row r1 = sheet.createRow(rowNum++);
            r1.createCell(0).setCellValue("Transport");
            r1.createCell(1).setCellValue(transport);

            Row r2 = sheet.createRow(rowNum++);
            r2.createCell(0).setCellValue("Electricity");
            r2.createCell(1).setCellValue(electricity);

            Row r3 = sheet.createRow(rowNum++);
            r3.createCell(0).setCellValue("Food");
            r3.createCell(1).setCellValue(food);

            Row r4 = sheet.createRow(rowNum++);
            r4.createCell(0).setCellValue("Shopping");
            r4.createCell(1).setCellValue(shopping);

            Row totalRow = sheet.createRow(rowNum++);
            totalRow.createCell(0).setCellValue("Total");
            totalRow.createCell(1).setCellValue(total);

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            workbook.close();

            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}