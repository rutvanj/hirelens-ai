import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * Capture a DOM element and export it as a multi-page A4 PDF.
 * @param {HTMLElement} element - The DOM node to capture.
 * @param {string} filename - Download filename (default: 'hirelens-report.pdf').
 */
export async function exportReportPdf(element, filename = 'hirelens-report.pdf') {
  console.log("exportReportPdf utility triggered for element:", element)
  
  if (!element) {
    console.error("No element provided to exportReportPdf")
    throw new Error("Target element is missing")
  }

  try {
    console.log("Starting html2canvas capture...")
    // Wait a tiny bit for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: '#FFF7FB',
      windowWidth: element.scrollWidth || 1200,
      onclone: (clonedDoc) => {
        // html2canvas 1.4.1 crashes on oklch/oklab colors (common in Tailwind 4)
        // We traverse the cloned DOM and force-convert these to standard RGB fallbacks.
        const allElements = clonedDoc.getElementsByTagName("*")
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i]
          const styles = window.getComputedStyle(el)
          
          const colorProps = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke']
          colorProps.forEach(prop => {
            const val = styles[prop]
            if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('color-mix'))) {
              console.log(`Sanitizing ${prop} for element:`, el.tagName, val)
              // Forced fallback to brand dark if it's text, or transparent/muted for others
              if (prop === 'color') el.style.color = '#243447'
              else if (prop === 'backgroundColor') el.style.backgroundColor = 'transparent'
              else if (prop === 'borderColor') el.style.borderColor = '#E7DDE5'
              else if (prop === 'fill') el.style.fill = '#5F9EA0'
              else if (prop === 'stroke') el.style.stroke = '#E7DDE5'
            }
          })
        }
      }
    })

    console.log("Canvas width:", canvas.width, "height:", canvas.height)
    const imgData = canvas.toDataURL('image/png')
    
    // A4 dimensions
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()
    
    const imgW = pdfW
    const imgH = (canvas.height * pdfW) / canvas.width
    
    let heightLeft = imgH
    let position = 0
    let pageCount = 1

    pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH)
    heightLeft -= pdfH

    while (heightLeft >= 0) {
      position = heightLeft - imgH
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH)
      heightLeft -= pdfH
      pageCount++
    }

    console.log(`Generated ${pageCount} pages. Triggering download...`)
    pdf.save(filename)
    console.log("pdf.save() called successfully.")
  } catch (err) {
    console.error("Error in exportReportPdf utility:", err)
    throw err
  }
}

