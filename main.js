<script>
function drawLifeMatrix(data) {
  const weeksPerRow = 52;
  const cellSize = 11.5;
  const spacing = 2;
  const yearLabelWidth = 25;

  const totalWidth = weeksPerRow * (cellSize + spacing) + spacing + yearLabelWidth;
  const totalWeeks = Math.ceil(data.lifeExpectancy * weeksPerRow);
  const rowCount = Math.ceil(totalWeeks / weeksPerRow);
  const totalHeight = rowCount * (cellSize + spacing) + spacing;

  const svgNS = "http://www.w3.org/2000/svg";
  let lifeMatrixSVG = document.createElementNS(svgNS, 'svg');
  lifeMatrixSVG.setAttribute('width', totalWidth);
  lifeMatrixSVG.setAttribute('height', totalHeight);
  lifeMatrixSVG.setAttribute('class', 'svg-hover-effect'); // Add class for hover effect

  const dobMoment = moment(data.dob, 'YYYY-MM-DD');

    const milestones = data.milestones.map(milestone => ({
        ...milestone,
        weekNumber: moment(milestone.date, "YYYY-MM-DD").diff(moment(data.dob, "YYYY-MM-DD"), 'years')*52 + Math.floor((moment(milestone.date, "YYYY-MM-DD").diff(moment(data.dob, "YYYY-MM-DD"), 'years', true) % 1)*52)
    }));
  
  for (let i = 0; i < totalWeeks; i++) {
    let xPosition = (i % weeksPerRow) * (cellSize + spacing) + spacing + yearLabelWidth;
    let yPosition = Math.floor(i / weeksPerRow) * (cellSize + spacing) + spacing;
    let weekDate = dobMoment.clone().add(Math.floor(i/52), 'years', 'weeks').add((i/52 % 1)*52, 'weeks');
    let weekData = getColorAndTitleForDate(weekDate, data);

    let weekRect = document.createElementNS(svgNS, 'rect');
    weekRect.setAttribute('x', xPosition);
    weekRect.setAttribute('y', yPosition);
    weekRect.setAttribute('width', cellSize);
    weekRect.setAttribute('height', cellSize);
    weekRect.setAttribute('fill', weekData.color); // Use color from weekData
    
    // Bootstrap tooltip attributes
    weekRect.setAttribute('data-bs-toggle', 'tooltip');
    weekRect.setAttribute('data-bs-placement', 'top');
    weekRect.setAttribute('title', weekData.title);

    //lifeMatrixSVG.appendChild(weekRect);

        const milestone = milestones.find(m => m.weekNumber === i);
        if (milestone) {
            // Draw a circle for the milestone
            let circle = document.createElementNS(svgNS, 'circle');
            let circleRadius = cellSize / 2;
            let circleXPosition = xPosition + circleRadius; // Adjust so the circle is centered in the cell
            let circleYPosition = yPosition + circleRadius; // Adjust so the circle is centered in the cell
            
            circle.setAttribute('cx', circleXPosition);
            circle.setAttribute('cy', circleYPosition);
            circle.setAttribute('r', circleRadius * 0.9); // Adjust radius as needed, 80% of half cell size
            circle.setAttribute('fill', 'orange'); // Set circle color to orange
            circle.setAttribute('stroke', '#333'); // Dark border around the circle
            circle.setAttribute('stroke-width', '1'); // Thin border width

            lifeMatrixSVG.appendChild(circle);

            // Set attributes for Bootstrap tooltip
            circle.setAttribute('data-bs-toggle', 'tooltip');
            circle.setAttribute('data-bs-placement', 'top');
            circle.setAttribute('title', `${milestone.title} Click me!`);
            circle.setAttribute('class', 'milestone-hover'); // Add class for hover effect
            // Add click event listener for the modal
            circle.addEventListener('click', () => {
              showModal(milestone); // Pass the whole milestone object
            });
              
        } else {lifeMatrixSVG.appendChild(weekRect);}
    
    // Only create year labels at the start of each row if it's a 5-year mark
    if (i % weeksPerRow === 0 && i / weeksPerRow % 5 === 0) {
      let yearLabel = document.createElementNS(svgNS, 'text');
      yearLabel.setAttribute('x', 10); // Adjust x position for label as needed
      yearLabel.setAttribute('y', yPosition + cellSize); // Center text vertically within the cell
      yearLabel.setAttribute('font-size', '11px');
      yearLabel.textContent = (i / weeksPerRow) / 5 * 5; // Calculate the year label
      lifeMatrixSVG.appendChild(yearLabel);
    }    
  }

  // Append the SVG to the DOM
  document.getElementById('life-calendar').appendChild(lifeMatrixSVG);

  // Activate Bootstrap tooltips
  activateBootstrapTooltips();
}

function getColorAndTitleForDate(date, data) {
  let result = { color: 'lightgrey', title: 'Future' }; // Default color and title
  if (date.isBefore(moment(data.dob)) || date.isAfter(moment(data.dob).add(data.lifeExpectancy, 'years'))) {
    return { color: 'white', title: '' }; // Before DOB or after expectancy
  }
  for (let range of data.ranges) {
    const start = moment(range.start);
    const end = range.end ? moment(range.end) : moment(); // Current date if no end
    if (date.isBetween(start, end, null, '[]')) {
      return { color: range.color, title: range.title };
    }
  }
  return result;
}

function showModal(milestone) {
    const { date, title, desc, img } = milestone; // Destructure for easier access
    
    // Check if an image link is provided and create an image tag accordingly
    const imgHtml = img ? `<img src="${img}" alt="${title}" class="img-fluid">` : ``;
    
    const modalHtml = `
        <div class="modal fade" id="milestoneModal" tabindex="-1" aria-labelledby="milestoneModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="milestoneModalLabel">${date} – ${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${imgHtml} <!-- Image is included here only if img is provided -->
                        <p>${desc}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('milestoneModal').classList.add('dark-layout');
    var milestoneModal = new bootstrap.Modal(document.getElementById('milestoneModal'), {});
    milestoneModal.show();

    // Remove the modal from DOM after it gets hidden
    $('#milestoneModal').on('hidden.bs.modal', function (event) {
        document.getElementById('milestoneModal').remove();
    });
}
 
function activateBootstrapTooltips() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
</script>
