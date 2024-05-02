function buildTable(rows, cols, startValue, table) {
  for (var i = 0; i < rows; i++) {
    var row = table.insertRow(i);
    var temp = startValue;
    for (var j = 0; j < cols; j++) {
      var cell = row.insertCell(j);
      cell.textContent = temp * (i + 1);
      temp++;
    }
  }
}

const form = document.querySelector('form');

form.addEventListener("submit", e => {
  e.preventDefault();

  form.classList.add('was-validated');

  const ip1 = document.getElementById("ip1").value;
  const ip2 = document.getElementById("ip2").value;

  var t1 = document.getElementById("t1");
  var t2 = document.getElementById("t2");
  var t3 = document.getElementById("t3");

  const x = ip1.split("#").map(Number);
  const y = ip2.split("#").map(Number);

  buildTable(x[0], x[1], x[2], t1);
  buildTable(y[0], y[1], y[2], t2);

  if (x[0] == y[0] && x[1] == y[1]) {
    if (x[2] == y[2]) {
      buildTable(y[0], y[1], y[2], t3);
    } else {
      for (var i = 0; i < x[0]; i++) {
        var row = t3.insertRow(i);
        for (var j = 0; j < x[1]; j++) {
          var cell = row.insertCell(j);

          var cell1 = t1.rows[i].cells[j];
          var cell2 = t2.rows[i].cells[j];
          cell.textContent =
            parseInt(cell1.textContent) * parseInt(cell2.textContent);
        }
      }
    }
  } else {
    document.getElementById("t3d").classList.add("hidden");
  }
});
