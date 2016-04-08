$(document).ready(function() {

  let
      canvas = '<canvas id="myChart" width="100" height="100"></canvas>',
      ctx,
      data,
      have,
      myPieChart = null,
      want;

  have = Number($('.coll_num').text());
  want = Number($('.want_num').text());

  data = [
          {
            color:'#E7413F',
            highlight: '#E7413F',
            label: 'Want',
            value: want
          },
          {
            color: '#60C43F',
            highlight: '#60C43F',
            label: 'Have',
            value: have
          }
        ];

  $('.section.statistics').append(canvas);

  ctx = $('#myChart').get(0).getContext('2d');

  myPieChart = new Chart(ctx).Doughnut(data, {animation:false, responsive: false, segmentStrokeColor: "#323334"});
});
