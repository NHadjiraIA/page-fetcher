const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var params = process.argv
            .slice(2);
var url = params[0];
var filePath = params[1];

request(url, (error, response, body) => {
  if(response == undefined){
    console.log('Invalid url provided. Url = %s', url)
    rl.close();
  }
  else
  {
    if(response.statusCode == 200){
      if(fs.existsSync(filePath)){
          rl.question('The file '+ filePath + ' already exists, do you want to overwrite it ? (y/n)', (answer) => {
            if(answer === 'y'){
              saveFile(filePath, body);
            }
            rl.close();
        });
      }
      else{
        saveFile(filePath, body);
      };
    }
    else{
      console.log("Could not download the file from %s. Api status code = %s", url, response.statusCode);
    }
  }
});

function saveFile(path, content){
    fs.writeFile(path, content, function(err){
      if(err){
        handleFileError(err);
      }
      else{
        console.log("Downloaded and saved %s bytes to %s.", fs.statSync(path).size, filePath)
      }
      rl.close();
    });
}

function handleFileError(err){
  console.log('the error code is : %s', err.code);
  if (err.code === 'ENOENT') {
    console.log('Error: Error: file path %s is not valid', filePath);
  } else {
    throw err;
  }
}