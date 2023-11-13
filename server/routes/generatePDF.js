const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require("path");
const filePath = path.join(__dirname, "../../public/KYC.pdf");
async function generatePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filePath = './public/KYC.pdf';
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      const fontSize = 12;
      doc.fontSize(fontSize);
      doc.font("Helvetica-Bold");
      const calculateCellHeight = (content) => {
        const textWidth = columnWidth - 10;
        const textHeight = doc.heightOfString(content, { width: textWidth });
        return textHeight;
      };
      const tableWidth = 500;
      const columnWidth = tableWidth / 2;
      const startX = 50;
      const addNewPageIfNeeded = (requiredSpace) => {
        if (startY + requiredSpace > doc.page.height - 50) {
          doc.addPage();
          startY = 50;
        }
      };
      const cellHeight = 50;
      const paddingTop = 10;
      const paddingBottom = 10;
      doc.fillColor("black");
      let startY = doc.y + 10;

      const additionalTextaaa = "KYC – Relocation to (Location)";
      const additionalTextHeightaaa = calculateCellHeight(additionalTextaaa);
      addNewPageIfNeeded(additionalTextHeightaaa);
      startY += additionalTextHeightaaa;
      const newXaaa = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalTextaaa, newXaaa + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeightaaa - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 20;
      const additionalTextaa = "Expatriate’s name | Company name";
      const additionalTextHeightaa = calculateCellHeight(additionalTextaa);
      addNewPageIfNeeded(additionalTextHeightaa);
      startY += additionalTextHeightaa;
      const newXaa = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalTextaa, newXaa + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeightaa - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 20;

      const additionalTexta = "LOOK & SEE TRIP";
      const additionalTextHeighta = calculateCellHeight(additionalTexta);
      addNewPageIfNeeded(additionalTextHeighta);
      startY += additionalTextHeighta;
      const newXa = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalTexta, newXa + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeighta - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 40;
      // .............................LOOK & SEE TRIP ...............................//
      const datass = [
        {
          staticData:
            "Do you already know the exact date / the precise period when the Look & See trip is taking place?",
          dynamicData: data.look_and_see.trip_date,
        },
        {
          staticData: "Who will accompany you during the Look & See Trip?",
          dynamicData: data.look_and_see.accompany,
        },
        {
          staticData:
            "Where will you be accommodated during the Look & See Trip? (hotel name and address)",
          dynamicData: data.look_and_see.accommodated,
        },
        {
          staticData: "What is the address of the company?",
          dynamicData: data.look_and_see.address,
        }
      ];

      datass.forEach((rowData) => {
        const staticDataHeight = calculateCellHeight(rowData.staticData);
        const adjustedCellHeight = Math.max(
          cellHeight,
          staticDataHeight + paddingTop + paddingBottom
        );
        doc.font("Helvetica");
        addNewPageIfNeeded(adjustedCellHeight);
        doc.rect(startX, startY, columnWidth, adjustedCellHeight).stroke();
        doc.text(rowData.staticData, startX + 5, startY + paddingTop, {
          width: columnWidth - 10,
          height: adjustedCellHeight - paddingTop - paddingBottom,
          align: "left",
        });
        doc
          .rect(startX + columnWidth, startY, columnWidth, adjustedCellHeight)
          .stroke();
        doc.text(
          rowData.dynamicData,
          startX + columnWidth + 5,
          startY + paddingTop,
          {
            width: columnWidth - 10,
            height: adjustedCellHeight - paddingTop - paddingBottom,
            align: "left",
          }
        );
        startY += adjustedCellHeight;
      });
      // ...............................EXPATRIATION...........................//

      const additionalText = "EXPATRIATION";
      const additionalTextHeight = calculateCellHeight(additionalText);
      addNewPageIfNeeded(additionalTextHeight);
      startY += additionalTextHeight;
      const newX = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalText, newX + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeight - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 40;

      doc.moveDown(3);
      const expatriationData = [
        {
          staticData:
            "Do you already know the exact date of expatriation? For how long will you stay in Brazil?",
          dynamicData: data.expatriation.exact_date,
        },
        {
          staticData: "To which city are you moving?",
          dynamicData: data.expatriation.moving_city,
        },
        {
          staticData: "Do you have any specific areas in mind for house hunting?",
          dynamicData: data.expatriation.area_house_hunting,
        },
        {
          staticData:
            "Do you have children? (if yes, please quote how many and the age)",
          dynamicData: data.expatriation.children?.additional_text,
        },
        {
          staticData:
            "Do you prefer to live near your office or children´s school/kindergarten?",
          dynamicData: data.expatriation.live_near,
        },
        {
          staticData: "Maximum commute time to work (driving time in min.):",
          dynamicData: data.expatriation.max_commute_time,
        },
        {
          staticData: "Do you have pets?",
          dynamicData: data.expatriation.pets?.additional_text,
        },
      ];

      expatriationData.forEach((rowData) => {
        const staticDataHeight = calculateCellHeight(rowData.staticData);
        const adjustedCellHeight = Math.max(
          cellHeight,
          staticDataHeight + paddingTop + paddingBottom
        );
        addNewPageIfNeeded(adjustedCellHeight);
        doc.font("Helvetica");
        doc.rect(startX, startY, columnWidth, adjustedCellHeight).stroke();
        doc.text(rowData.staticData, startX + 5, startY + paddingTop, {
          width: columnWidth - 10,
          height: adjustedCellHeight - paddingTop - paddingBottom,
          align: "left",
        });
        doc
          .rect(startX + columnWidth, startY, columnWidth, adjustedCellHeight)
          .stroke();
        doc.text(
          rowData.dynamicData,
          startX + columnWidth + 5,
          startY + paddingTop,
          {
            width: columnWidth - 10,
            height: adjustedCellHeight - paddingTop - paddingBottom,
            align: "left",
          }
        );

        startY += adjustedCellHeight;
      });
      //................................... BUDGET INFORMATION .....................//

      const additionalTexts = "BUDGET INFORMATION";
      const additionalTextHeights = calculateCellHeight(additionalTexts);
      addNewPageIfNeeded(additionalTextHeights);
      startY += additionalTextHeights;
      const newXs = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalTexts, newXs + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeights - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 50;

      let budgetInformation = [
        {
          staticData1: "",
          staticData: "Furnished:",
          dynamicData: "Including IPTU (tax) & Condominium fee:",
          dynamicData1: "Excluding IPTU (tax) & Condominium fee:",
        },
        {
          staticData1: "Housing-Budget:",
          staticData: data?.budget_information?.furnished?.budget,
          dynamicData: data?.budget_information?.furnished?.including_IPTU,
          dynamicData1: data?.budget_information?.furnished?.excluding_IPTU,
        },
        {
          staticData1: "",
          staticData: "Unfurnished:",
          dynamicData: "Excluding IPTU (tax) & Condominium fee:",
          dynamicData1: "Excluding IPTU (tax) & Condominium fee:",
        },
        {
          staticData1: "Housing-Budget:",
          staticData: data?.budget_information?.unfurnished?.budget,
          dynamicData: data?.budget_information?.unfurnished?.including_IPTU,
          dynamicData1: data?.budget_information?.unfurnished?.excluding_IPTU,
        },
      ];

      const rowHeightss = 70;
      const paddingTopsss = 10;
      const paddingBottomsss = 10;
      const availablePageWidthsss = doc.page.width - startX * 2;
      const columnCountsss = 4;

      const maxColumnWidths = [0, 0, 0, 0];

      budgetInformation.forEach((rowData) => {
        maxColumnWidths[0] = Math.max(
          maxColumnWidths[0],
          doc.widthOfString(rowData.staticData1)
        );
        maxColumnWidths[1] = Math.max(
          maxColumnWidths[1],
          doc.widthOfString(rowData.staticData)
        );
        maxColumnWidths[2] = Math.max(
          maxColumnWidths[2],
          doc.widthOfString(rowData.dynamicData)
        );
        maxColumnWidths[3] = Math.max(
          maxColumnWidths[3],
          doc.widthOfString(rowData.dynamicData1)
        );
      });

      const columnWidthsss =
        (availablePageWidthsss - (columnCountsss - 1) * 10) / columnCountsss;
      budgetInformation.forEach((rowData) => {
        addNewPageIfNeeded(rowHeightss);
        doc.font("Helvetica");
        let x = startX;
        for (let i = 0; i < columnCountsss; i++) {
          doc.rect(x, startY, columnWidthsss, rowHeightss).stroke();

          doc.text(
            rowData[
            i === 0
              ? "staticData1"
              : i === 1
                ? "staticData"
                : i === 2
                  ? "dynamicData"
                  : "dynamicData1"
            ],
            x + 5,
            startY + paddingTopsss,
            {
              width: columnWidthsss - 10,
              height: rowHeightss - paddingTopsss - paddingBottomsss,
              align: "left",
            }
          );

          x += columnWidthsss; // Remove the margin between columns
        }

        startY += rowHeightss;
      });

      // .................................HOUSING INFORMATION ...........................//

      const additionalTextss = "HOUSING INFORMATION";
      const additionalTextHeightss = calculateCellHeight(additionalTextss);
      addNewPageIfNeeded(additionalTextHeightss);
      startY += additionalTextHeightss;
      const newXss = 45;
      doc.font("Helvetica-Bold");
      doc.text(additionalTextss, newXss + 5, startY + paddingTop, {
        width: columnWidth - 10,
        height: additionalTextHeights - paddingTop - paddingBottom,
        align: "left",
      });
      startY += 50;
      const housingInformation = [
        {
          staticData1: "",
          staticData: "House",
          dynamicData: "Apartment",
        },
        {
          staticData1:
            "Are you looking for a house or apartment? (multiple selection possible)",
          staticData:
            data?.housing_information?.house?.is_exist === true ? "Yes" : "No",
          dynamicData:
            data?.housing_information?.apartment?.is_exist === true
              ? "Yes"
              : "No",
        },
        {
          staticData1: "Size in square meters of house/apartment:",
          staticData: `Min: ${data?.housing_information?.house?.size?.min} - Max: ${data?.housing_information?.house?.size?.max}`,
          dynamicData: `Min: ${data?.housing_information?.apartment?.size?.min} - Max: ${data?.housing_information?.apartment?.size?.max}`,
        },
        {
          staticData1:
            "Do you prefer furnished or unfurnished? (multiple selection possible)",
          staticData:
            data?.housing_information?.house?.furnished === true
              ? "Furnished"
              : "Unfurnished",
          dynamicData:
            data?.housing_information?.apartment?.furnished === true
              ? "Furnished"
              : "Unfurnished",
        },
        {
          staticData1: "Number of bedrooms:",
          staticData: data?.housing_information?.house?.bedrooms,
          dynamicData: data?.housing_information?.apartment?.bedrooms,
        },
        {
          staticData1: "Number of bathrooms: ",
          staticData: data?.housing_information?.house?.bathrooms,
          dynamicData: data?.housing_information?.apartment?.bathrooms,
        },
        {
          staticData1: "Number of workrooms:",
          staticData: data?.housing_information?.house?.workrooms,
          dynamicData: data?.housing_information?.apartment?.workrooms,
        },
        {
          staticData1: "Number of parking slots:",
          staticData: data?.housing_information?.house?.parking_slots,
          dynamicData: data?.housing_information?.apartment?.parking_slots,
        },
      ];

      const rowHeight = 50;
      const paddingTops = 10;
      const paddingBottoms = 10;
      const availablePageWidth = doc.page.width - startX * 2;
      const columnCount = 3;
      const columnWidths = availablePageWidth / columnCount;

      housingInformation.forEach((rowData) => {
        addNewPageIfNeeded(rowHeight);
        for (let i = 0; i < columnCount; i++) {
          doc.font("Helvetica");
          doc
            .rect(startX + i * columnWidths, startY, columnWidths, rowHeight)
            .stroke();
        }
        doc.text(rowData.staticData1, startX + 5, startY + paddingTops, {
          width: columnWidths - 10,
          height: rowHeight - paddingTops - paddingBottoms,
          align: "left",
        });

        doc.text(
          rowData.staticData,
          startX + columnWidths + 5,
          startY + paddingTops,
          {
            width: columnWidths - 10,
            height: rowHeight - paddingTops - paddingBottoms,
            align: "left",
          }
        );

        doc.text(
          rowData.dynamicData,
          startX + 2 * columnWidths + 5,
          startY + paddingTops,
          {
            width: columnWidths - 10,
            height: rowHeight - paddingTops - paddingBottoms,
            align: "left",
          }
        );
        startY += rowHeight;
      });

      //..................FACILITIES OF THE CONDOMINIUM (HOUSING AREA) / DISTANCES ..................//
      const additionalTextssss =
        "FACILITIES OF THE CONDOMINIUM (HOUSING AREA) / DISTANCES";
      const additionalTextHeightssss = calculateCellHeight(additionalTextssss);
      addNewPageIfNeeded(additionalTextHeightssss);
      startY += additionalTextHeightssss;
      const newXssss = 50;
      const textAreaHeight =
        additionalTextHeightssss - paddingTop - paddingBottom + 100;

      doc.font("Helvetica-Bold");
      doc.text(additionalTextssss, newXssss + 5, startY + paddingTop, {
        width: 500 - 10,
        height: textAreaHeight,
        align: "left",
      });
      startY += 50;

      let facilities = [
        {
          staticData: "Terrace/balcony:",
          dynamicData: data.facilities.terrace_balcony,
        },
        {
          staticData: "Gym:",
          dynamicData: data.facilities.gym,
        },
        {
          staticData: "Tennis court:",
          dynamicData: data.facilities.tennis_court,
        },
        {
          staticData: "Pool:",
          dynamicData: data.facilities.pool,
        },
        {
          staticData: "Sauna:",
          dynamicData: data.facilities.sauna,
        },
        {
          staticData: "Children´s playground:",
          dynamicData: data.facilities.children_playground,
        },
        {
          staticData: "Distance to work:",
          dynamicData: data.facilities.distance_to_work,
        },
        {
          staticData: "Distance to school/kindergarten:",
          dynamicData: data.facilities.distance_to_school_kindergarten,
        },
        {
          staticData: "Distance to shopping facilities:",
          dynamicData: data.facilities.distance_to_shopping_facilities,
        },
        {
          staticData: "Distance to public transport:",
          dynamicData: data.facilities.distance_to_public_transport,
        },
        {
          staticData: "Distance to restaurants/bars:",
          dynamicData: data.facilities.distance_to_restaurants_bars,
        },
      ];

      facilities.forEach((rowData) => {
        const staticDataHeight = calculateCellHeight(rowData.staticData);
        const adjustedCellHeight = Math.max(
          cellHeight,
          staticDataHeight + paddingTop + paddingBottom
        );

        addNewPageIfNeeded(adjustedCellHeight);

        doc.rect(startX, startY, columnWidth, adjustedCellHeight).stroke();
        doc.font("Helvetica");
        doc.text(rowData.staticData, startX + 5, startY + paddingTop, {
          width: columnWidth - 10,
          height: adjustedCellHeight - paddingTop - paddingBottom,
          align: "left",
        });
        doc
          .rect(startX + columnWidth, startY, columnWidth, adjustedCellHeight)
          .stroke();
        doc.text(
          rowData.dynamicData,
          startX + columnWidth + 5,
          startY + paddingTop,
          {
            width: columnWidth - 10,
            height: adjustedCellHeight - paddingTop - paddingBottom,
            align: "left",
          }
        );

        startY += adjustedCellHeight;
      });

      // .....................................IS THERE ANY OTHER ADDITIONAL INFORMATION FOR US TO KNOW? .............//

      const additionalTextsssss =
        "IS THERE ANY OTHER ADDITIONAL INFORMATION FOR US TO KNOW?";
      const additionalTextHeightsssss = calculateCellHeight(additionalTextsssss);
      addNewPageIfNeeded(additionalTextHeightsssss);
      startY += additionalTextHeightsssss;
      const newXsssss = 50;
      const textAreaHeights =
        additionalTextHeightsssss - paddingTop - paddingBottom + 100;

      doc.font("Helvetica-Bold");
      doc.text(additionalTextsssss, newXsssss + 5, startY + paddingTop, {
        width: 520 - 10,
        height: textAreaHeights,
        align: "left",
      });
      startY += 50;
      let isdata = [
        {
          dynamicData: data?.additional_information,
        },
      ];

      isdata.forEach((rowData) => {
        const dynamicData = rowData.dynamicData; // Retrieve dynamicData from isdata

        // Calculate the height for each row based on the dynamicData
        const dynamicDataHeight = calculateCellHeight(dynamicData);
        const adjustedCellHeight = Math.max(
          dynamicDataHeight,
          cellHeight + paddingTop + paddingBottom
        );

        doc.font("Helvetica");
        addNewPageIfNeeded(adjustedCellHeight);

        // Set the width to 500 for a fixed width
        const fixedWidth = 500;

        // Draw a single rectangular box for the dynamic data
        doc.rect(startX, startY, fixedWidth, adjustedCellHeight).stroke();

        // Place the dynamic data within the single column and use the fixed width
        doc.text(dynamicData, startX + 5, startY + paddingTop, {
          width: fixedWidth,
          height: adjustedCellHeight - paddingTop - paddingBottom,
          align: "left",
        });

        startY += adjustedCellHeight;
      });
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      writeStream.on('error', (error) => {
        reject(error);
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  })
}


module.exports = generatePDF;
