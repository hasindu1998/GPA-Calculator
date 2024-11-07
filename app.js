let moduleCount = 0;
let modules = [];
let totalCreditPoints = 0;

// Submit number of modules
function submitModuleCount() {
    moduleCount = parseInt(document.getElementById('moduleCount').value);
    if (moduleCount > 0) {
        generateModuleInputFields();
    } else {
        alert("Please enter a valid number of modules.");
    }
}

// Generate input fields for each module
function generateModuleInputFields() {
    const moduleDetailsForm = document.getElementById('moduleDetailsForm');
    moduleDetailsForm.innerHTML = "";
    moduleDetailsForm.classList.remove('hidden');

    for (let i = 0; i < moduleCount; i++) {
        moduleDetailsForm.innerHTML += `
            <div class="flex flex-col space-y-2">
                <label>Module ${i + 1}</label>
                <input type="text" placeholder="Module Name" class="input-field" id="moduleName${i}">
                <input type="text" placeholder="Module Code" class="input-field" id="moduleCode${i}">
                <input type="number" placeholder="Credit Points" class="input-field" id="creditPoints${i}">
            </div>`;
    }
    moduleDetailsForm.innerHTML += `<button type="button" class="btn-primary" onclick="submitModuleDetails()">Submit Modules</button>`;
}

// Collect module details and calculate total credit points
function submitModuleDetails() {
    modules = [];
    totalCreditPoints = 0;

    for (let i = 0; i < moduleCount; i++) {
        const moduleName = document.getElementById(`moduleName${i}`).value;
        const moduleCode = document.getElementById(`moduleCode${i}`).value;
        const creditPoints = parseFloat(document.getElementById(`creditPoints${i}`).value);
        
        if (!moduleName || !moduleCode || isNaN(creditPoints)) {
            alert("Please fill out all fields for each module.");
            return;
        }

        modules.push({ moduleName, moduleCode, creditPoints });
        totalCreditPoints += creditPoints;
    }
    generateGradeInputFields();
}

// Generate grade input fields for GPA calculation
function generateGradeInputFields() {
    const moduleDetailsForm = document.getElementById('moduleDetailsForm');
    moduleDetailsForm.innerHTML = "";
    
    modules.forEach((module, index) => {
        moduleDetailsForm.innerHTML += `
            <div class="flex flex-col space-y-2">
                <label>${module.moduleName} (${module.moduleCode})</label>
                <input type="text" placeholder="Grade" class="input-field" id="grade${index}">
                <input type="number" placeholder="Grade Points" class="input-field" step="0.1" id="gradePoints${index}">
            </div>`;
    });
    moduleDetailsForm.innerHTML += `<button type="button" class="btn-primary" onclick="calculateGPA()">Calculate GPA</button>`;
}

// Calculate GPA based on inputted grade points
function calculateGPA() {
    let totalGradePoints = 0;
    
    modules.forEach((module, index) => {
        const gradePoints = parseFloat(document.getElementById(`gradePoints${index}`).value);
        
        if (isNaN(gradePoints)) {
            alert("Please enter valid grade points for each module.");
            return;
        }

        totalGradePoints += gradePoints * module.creditPoints;
    });

    const gpa = totalGradePoints / totalCreditPoints;
    displayResult(gpa.toFixed(2));
}

// Display GPA result and provide download option
function displayResult(gpa) {
    const resultDiv = document.getElementById('gpaResult');
    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `Your GPA is: <strong>${gpa}</strong><br><button class="btn-primary mt-2" onclick="downloadReport(${gpa})">Download Report</button>`;
}

// Download GPA report as PDF
function downloadReport(gpa) {
    // Import jsPDF module
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set document title
    doc.setFontSize(16);
    doc.text("GPA Report", 10, 10);

    // Prepare table content
    const tableData = modules.map((module, index) => [
        index + 1,
        module.moduleName,
        module.moduleCode,
        module.creditPoints,
        document.getElementById(`grade${index}`).value,
        document.getElementById(`gradePoints${index}`).value
    ]);

    // Add table using autoTable plugin
    doc.autoTable({
        startY: 20,
        head: [['#', 'Module Name', 'Module Code', 'Credit Points', 'Grade', 'Grade Points']],
        body: tableData,
    });

    // Add GPA result at the bottom
    doc.setFontSize(14);
    doc.text(`Total Credit Points: ${totalCreditPoints}`, 10, doc.lastAutoTable.finalY + 10);
    doc.text(`GPA: ${gpa}`, 10, doc.lastAutoTable.finalY + 20);

    // Save the PDF
    doc.save("GPA_Report.pdf");
}

