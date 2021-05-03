import React, { useState, useEffect, useRef  } from 'react';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const LoadPDF = () => {
    const [pdfInfo, setPdfInfo] = useState([]);
  
    useEffect(() => {
      modifyPdf();
    }, []);
    
    const viewer = useRef(null);

    const modifyPdf = async () => {
      const existingPdfBytes = await fetch(
        "https://symply-resources.s3-us-west-2.amazonaws.com/Symply+MSA+v4.pdf"
      ).then((res) => res.arrayBuffer());
  
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Get the width and height of the first page
      const { width, height } = firstPage.getSize();
      firstPage.drawText("testing edit pdf", {
        x: 5,
        y: height / 2 + 300,
        size: 30,
        font: helveticaFont,
        color: rgb(0.95, 0.1, 0.1),
        rotate: degrees(0),
      });

      const form = pdfDoc.getForm()

      const superheroField = form.createTextField('favorite.superhero')
      superheroField.setText('')
      superheroField.addToPage(firstPage, { x: 35, y: 440 })
  
      const pdfBytes = await pdfDoc.save();
    //   const docUrl = URL.createObjectURL(
    //     new Blob(pdfBytes, { type: "application/pdf" })
    //   );

      var bytes = new Uint8Array(pdfBytes); 
      var blob = new Blob([bytes], { type: "application/pdf" });
      const docUrl = URL.createObjectURL(blob);
      setPdfInfo(docUrl);
    };
    
    return (
    //   <>{<iframe title="test-frame" src={pdfInfo} ref={viewer} type="application/pdf" height= "100%" />}</>
      <>{<iframe title="test-frame" src={pdfInfo} ref={viewer} type="application/pdf" width= "850" height= "950" />}</>
    );
  };
  
  export default LoadPDF;