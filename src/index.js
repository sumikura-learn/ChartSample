import { Chart } from 'chart.js/auto';

function generateIntegralData(minX, maxX, minY, maxY, count) {
    const arr = [];
    let currentX = minX;
    let currentY = minY;
    const stepX = (maxX - minX) / count;
    const stepY = (maxY - minY) / count;
  
    while (arr.length < count) {
      arr.push({ x: currentX, y: currentY });
      currentX += stepX;
    //   currentY += stepY;
    //   currentY += Math.random() * ((maxY - minY) / count); // ランダム生成
      currentY += Math.random() * ((maxY - minY) / count) * 10; // ランダム生成
    }
    return arr;
  }
const dataCount = 500; // 数値変更でポイントの数が増える
const ctx = document.getElementById("myChart").getContext("2d");
const baseData = generateIntegralData(-20, 20, 202, 214, dataCount); 
const comparisonData = baseData.map((val, idx) => ({ x: val.x, y: val.y + Math.sin(idx / 10) * 5 + Math.cos(idx / 5) * 3 }));


// ランダム生成
// const comparisonData = baseData.map((val, idx) => ({ 
//     x: val.x, 
//     y: val.y + Math.random() * 10 - 5 + Math.sin(Math.random() * Math.PI * 2) * 5 
//   }));


const higherData = comparisonData.map((val, idx) =>
  val.y > baseData[idx].y ? val : { x: val.x, y: null }
);
const lowerData = comparisonData.map((val, idx) =>
  val.y <= baseData[idx].y ? val : { x: val.x, y: null }
);

const data = {
  datasets: [
    {
      label: "BaseLine",
      data: baseData,
      borderColor: "green",
      backgroundColor: "rgba(0,0,255,0.5)",
      fill: false,
      borderWidth: 5, // 基準データの線の太さを増やす
    },
    {
      label: "High",
      data: higherData,
      borderColor: "red",
      backgroundColor: "rgba(255,0,0,0.5)",
      fill: -1,
      showLine: true, //ライン描画
      pointRadius: 1,
    },
    {
      label: "Low",
      data: lowerData,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.5)",
      fill: -1,
      showLine: true, //ライン描画
      pointRadius: 1,
    },
  ],
};

const myChart = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    scales: {
        x: {
            type: 'linear',
            title: {
              display: true,
              text: '距離(m)'
            },
            ticks: {
              callback: function(value, index, values) {
                return parseInt(value);
              }
            },
          },
      y: {
        title: {
          display: true,
          text: '標高(m)'
        },
        beginAtZero: false,
        ticks: {
          stepSize: 2,
          callback: function(value, index, values) {
            return parseInt(value);
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label) {
              return label + ': (' + context.parsed.x + ', ' + context.parsed.y + ')';
            }
            return '(' + context.parsed.x + ', ' + context.parsed.y + ')';
          }
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 10,
      },
    },
  },
  plugins: [
    {
      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          if (dataset.label !== "BaseLine") {
            const meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (element, index) {
                if (dataset.data[index] !== null && dataset.data[index].y !== null) {
                  const baseElement = chart.getDatasetMeta(0).data[index];
                  if (
                    (dataset.label === "High" && dataset.data[index].y > baseData[index].y) ||
                    (dataset.label === "Low" && dataset.data[index].y < baseData[index].y)
                  ) {
                    ctx.beginPath();
                    ctx.moveTo(element.x, baseElement.y);
                    ctx.lineTo(element.x, element.y);
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

myChart.update();
