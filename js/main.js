const url = '../docs/pdf.pdf';

let pdfDoc = null;
let pageNum = 1;
const scale = 1.5;

const canvas = document.querySelector('#pdf-render');
const ctx = canvas.getContext('2d');

// Render page
const renderPage = pageNum => {
  // Get page
  pdfDoc.getPage(pageNum).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    }

    page.render(renderCtx).promise.then(() => {
      // after page render            
      console.log(`render page ${pageNum}`);
    });
  });
}

// Get Document
pdfjsLib.getDocument(url).promise
  .then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    console.log(`number of pages : ${pdfDoc.numPages}`);
    renderPage(pageNum);
  })
  .catch(err => {
    console.log(err.message);
    document.querySelector('.top-bar').remove();
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, document.querySelector('canvas'));
  });

// Events
const onClickPrevBtn = () => {
  if (pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
}

const onClickNextBtn = () => {
  if (pageNum < pdfDoc.numPages) {
    pageNum++;
    renderPage(pageNum);
  }
}

// Add event listener
document.querySelector('#prev-page').addEventListener('click', onClickPrevBtn);
document.querySelector('#next-page').addEventListener('click', onClickNextBtn);