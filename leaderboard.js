fetch('https://sheetdb.io/api/v1/1s6kwc2vjrjbx')
.then(res=>res.json())
.then(data=>loadHighScores(data));
async function loadHighScores(data){
  let rank=1;
  const table= document.querySelector('.leaderboard');
  data.sort((a, b) => {
      if (parseInt(a.highscore) < parseInt(b.highscore)) {
        return 1;
      }
      if (parseInt(a.highscore) > parseInt(b.highscore)) {
        return -1;
      }
      return 0;
  });
  data.forEach(element => {
      let tr = table.insertRow(-1);
      let cell1= tr.insertCell(0);
      let cell2= tr.insertCell(1);
      let cell3= tr.insertCell(2);
      cell1.innerHTML = rank++;
      cell2.innerHTML = element.username.toUpperCase();
      cell3.innerHTML = element.highscore;
  });
    
}
