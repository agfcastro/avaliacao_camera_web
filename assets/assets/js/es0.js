var es;

async function loadEval() {
  if (!es) {
    es = await EvalSheet();
  }  
}

function deleteMat(mat) {
  mat.delete();
}

function allocate(imgData) {
  var buffer = es._malloc(imgData.byteLength);
  es.HEAPU8.set(imgData, buffer);
  return buffer;
}

function deallocate(buffer) {
  es._free(buffer);
}

function initScanner(imgData, imgWidth, imgHeight, amountBlocks, questionsByBlock, itensByQuestion) {
  var buffer = allocate(imgData);
  var api = new es["EvalSheetApi"](buffer, imgWidth, imgHeight, amountBlocks, questionsByBlock, itensByQuestion);
  deallocate(buffer);
  return api;
}

function ImageDataToBase64(imageData, width, height) {
  let canvas = document.getElementById('canvasTmp');
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

function pointsToJson(points) {
  const totalSize = points.size();
  const output = [];
  for (let i = 0; i < totalSize; i += 8) {

    output.push(
      // Canto 0
      { x: points.get(i), y: points.get(i + 1) },
      // Canto 1
      { x: points.get(i + 2), y: points.get(i + 3) },
      // Canto 2
      { x: points.get(i + 4), y: points.get(i + 5) },
      // Canto 3
      { x: points.get(i + 6), y: points.get(i + 7) },
    );
  }
  return JSON.stringify(output);
}

function errorsToJson(listError) {
  let errors = [];
  if (listError !== undefined && listError.size() > 0) {
    for (let index = 0; index < listError.size(); index++) {
      errors.push(listError.get(index));
    }
  }
  return JSON.stringify(errors);
}

function answersToJson(listAnswer, amountBlocks) {
  // var blocks = listAnswer;
  var initial = 0;
  var listObjects = [];

  //console.info("amountBlocks " + amountBlocks);
  if (amountBlocks == 1) {
    var objBlock = {};
    objBlock.block = 1;
    objBlock.answers = [];

    for (var b = 0; b < listAnswer.size(); b++) {
      var answers = listAnswer.get(b);
      for (var a = 0; a < answers.size(); a++) {
        initial++;
        var objAnswer = {};
        objAnswer.question = initial;
        objAnswer.answer = answers.get(a);
        objBlock.answers.push(objAnswer);
      }
    }
    listObjects.push(objBlock);
  } else {
    for (var b = 0; b < listAnswer.size(); b++) {
      var objBlock = {};
      objBlock.block = b + 1;
      var answers = listAnswer.get(b);
      objBlock.answers = [];
      for (var a = 0; a < answers.size(); a++) {
        var objAnswer = {};
        objAnswer.question = (a + 1);
        objAnswer.answer = answers.get(a);
        objBlock.answers.push(objAnswer);
      }
      listObjects.push(objBlock);
    }
  }

  return JSON.stringify(listObjects);
}

function matToBase64(mat) {
  var data = mat.data; // output is a Uint8Array that aliases directly into the Emscripten heap

  var channels = mat.channels();
  var channelSize = mat.elemSize1();

  var canvas = document.getElementById('canvasDst');

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = mat.columns;
  canvas.height = mat.rows;

  //var imdata = ctx.createImageData(mat.columns, mat.rows);
  var imdata = ctx.createImageData(canvas.width, canvas.height);

  for (var i = 0, j = 0; i < data.length; i += channels, j += 4) {
    imdata.data[j] = data[i];
    imdata.data[j + 1] = data[i + (1 % channels)];
    imdata.data[j + 2] = data[i + (2 % channels)];
    imdata.data[j + 3] = 255;
  }

  ctx.putImageData(imdata, 0, 0);

  return canvas.toDataURL();
}