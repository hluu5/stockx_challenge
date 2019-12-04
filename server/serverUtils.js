module.exports = {
  //custom util function to parse a stream of shoes data then store in an obj (in memory)
  //this obj which holds shoes data will be inserted to database
  //This method can create memory leak since it's storing data in memory before inserting to db.
  //In real production, we could write to a json file then create a readStream and parse that json file to write
  //into db or do Transform Stream.
  parseStreamAndWriteDataObj: (destinationObj, streamObj) => {
    if (!destinationObj[streamObj['shoesname']]) {
      destinationObj[streamObj['shoesname']] = {
        shoesSize: {
          '1': streamObj['shoeSizeData']['1'],
          '2': streamObj['shoeSizeData']['2'],
          '3': streamObj['shoeSizeData']['3'],
          '4': streamObj['shoeSizeData']['4'],
          '5': streamObj['shoeSizeData']['5']
        },
        trueToSizeCalculation: 0
      }
    } else {
      let AvgTrueToSize = destinationObj[streamObj['shoesname']]['trueToSizeCalculation'];
      const numerator = (streamObj['shoeSizeData']['1']*1+streamObj['shoeSizeData']['2']*2+streamObj['shoeSizeData']["3"]*3+streamObj['shoeSizeData']["4"]*4+streamObj['shoeSizeData']["5"]*5);
      const denominator = streamObj['shoeSizeData']['1']+streamObj['shoeSizeData']['2']+streamObj['shoeSizeData']["3"]+streamObj['shoeSizeData']["4"]+streamObj['shoeSizeData']["5"];
      AvgTrueToSize = (AvgTrueToSize+(numerator/denominator))/2;
      destinationObj[streamObj['shoesname']]['trueToSizeCalculation'] = AvgTrueToSize;
      // console.log(destinationObj[streamObj['shoesname']].shoesSize['1'])
      destinationObj[streamObj['shoesname']].shoesSize['1'] = destinationObj[streamObj['shoesname']].shoesSize['1']+streamObj['shoeSizeData']['1']
      destinationObj[streamObj['shoesname']].shoesSize['2'] = destinationObj[streamObj['shoesname']].shoesSize['2']+streamObj['shoeSizeData']['2']
      destinationObj[streamObj['shoesname']].shoesSize['3'] = destinationObj[streamObj['shoesname']].shoesSize['3']+streamObj['shoeSizeData']['3']
      destinationObj[streamObj['shoesname']].shoesSize['4'] = destinationObj[streamObj['shoesname']].shoesSize['4']+streamObj['shoeSizeData']['4']
      destinationObj[streamObj['shoesname']].shoesSize['5'] = destinationObj[streamObj['shoesname']].shoesSize['5']+streamObj['shoeSizeData']['5']
    }
    // console.log(destinationObj)
  }
}