const QUALIFIED_API_URL = "https://script.google.com/macros/s/AKfycbyQaJx7w4FG17GUa6BMsEAgjb4T71ZShaTFKkXDMLqTAiyTlvyCzqNv59QvG-CzCqMd/exec";

// Load all qualified leads
function loadQualified() {
  fetch(QUALIFIED_API_URL)
    .then(res => res.json())
    .then(data => {
      const qualified = data.filter(lead => lead.status === "Qualified");
      const container = document.getElementById("qualifiedList");
      container.innerHTML = "";

      qualified.forEach(lead => {
        const div = document.createElement("div");
        div.classList.add("qualified-lead");

        div.innerHTML = `
          <h3>${lead.name}</h3>
          <div>
            ${['proposal','quotation','contract','strategy','moodboard','deliverables'].map(stage => `
              <label>${stage}:</label>
              <select onchange="updateQualified('${lead.id}', '${stage}', this.value)">
                <option ${lead[stage] === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option ${lead[stage] === 'Done' ? 'selected' : ''}>Done</option>
                <option ${lead[stage] === 'Stuck' ? 'selected' : ''}>Stuck</option>
              </select>
            `).join('')}
          </div>
        `;
        container.appendChild(div);
      });
    });
}

// Send status updates to Google Sheet
function updateQualified(leadId, stage, value) {
  const payload = {qualified_update: {lead_id: leadId, stage: stage, value: value}};
  fetch(QUALIFIED_API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => loadQualified());
}

// Initial load
loadQualified();
