// function generateUniqueRandomNumbersInRange(min, max, count) {
//     const arr = [];
//     while (arr.length < count) {
//       const randomnumber = Math.random() * (max - min) + min;
//       if (arr.every((item) => item.toFixed(2) !== randomnumber.toFixed(2))) {
//         arr.push(randomnumber);
//       }
//     }
//     return arr;
//   }
  
//   const baseData = generateUniqueRandomNumbersInRange(0, 7, 100);
//   const comparisonData = generateUniqueRandomNumbersInRange(0, 7, 100);
  
const ctx = document.getElementById("myChart").getContext("2d");
  
const baseData = [5, 6, 5, 7, 5, 6];
const comparisonData = [7, 5, 6, 4, 7, 5];

const higherData = comparisonData.map((val, idx) =>
  val > baseData[idx] ? val : null
);
const lowerData = comparisonData.map((val, idx) =>
  val <= baseData[idx] ? val : null
);

const data = {
  labels: [0, 1, 2, 3, 4, 5],
  datasets: [
    {
      label: "Base Dataset",
      data: baseData,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.5)",
      fill: false,
    },
    {
      label: "Higher Comparison Dataset",
      data: higherData,
      borderColor: "red",
      backgroundColor: "rgba(255,0,0,0.5)",
      fill: -1,
      showLine: true,
      pointRadius: 1,
    },
    {
      label: "Lower Comparison Dataset",
      data: lowerData,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.5)",
      fill: -1,
      showLine: true,
      pointRadius: 1,
    },
  ],
};

const myChart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
  plugins: [
    {
      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          if (dataset.label !== "Base Dataset") {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (element, index) {
                if (dataset.data[index] !== null) {
                  const baseElement = chart.getDatasetMeta(0).data[index];
                  if (
                    dataset.label === "Higher Comparison Dataset" &&
                    dataset.data[index] > baseData[index]
                  ) {
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(baseElement.x, baseElement.y);
                    ctx.lineWidth = 4.0;
                    ctx.strokeStyle = dataset.borderColor;
                    ctx.stroke();
                    ctx.restore();
                  }
                  if (
                    dataset.label === "Lower Comparison Dataset" &&
                    dataset.data[index] < baseData[index]
                  ) {
                    ctx.beginPath();
                    ctx.moveTo(element.x, element.y);
                    ctx.lineTo(baseElement.x, baseElement.y);
                    ctx.lineWidth = 4.0;
                    ctx.strokeStyle = dataset.borderColor;
                    ctx.stroke();
                  }
                }
              });
            }
          }
        });
      },
    },
  ],
});
