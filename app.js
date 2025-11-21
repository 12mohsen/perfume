// Store perfumes and perfume names in localStorage
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
let perfumeNames = JSON.parse(localStorage.getItem('perfumeNames')) || [];

// Theme management
const themes = ['theme-default', 'theme-light', 'theme-purple', 'theme-dark-blue', 'theme-luxury', 'theme-rose-silk'];
let currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex')) || 0;

// DOM Elements
const perfumeForm = document.getElementById('perfumeForm');
const oilsContainer = document.getElementById('oilsContainer');
const addOilBtn = document.getElementById('addOil');
const favoritesList = document.getElementById('favoritesList');
const deleteAllBtn = document.getElementById('deleteAll');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close-modal');
const editForm = document.getElementById('editForm');
const themeToggle = document.getElementById('themeToggle');

// Perfume Names List Elements
const togglePerfumeList = document.getElementById('togglePerfumeList');
const perfumeNamesList = document.getElementById('perfumeNamesList');
const newPerfumeNameInput = document.getElementById('newPerfumeName');
const savePerfumeNameBtn = document.getElementById('savePerfumeName');
const savedPerfumeNamesList = document.getElementById('savedPerfumeNames');
const selectAllNames = document.getElementById('selectAllNames');
const deleteSelectedNames = document.getElementById('deleteSelectedNames');
const deleteAllNames = document.getElementById('deleteAllNames');

let currentEditId = null;

// Theme toggle functionality
function updateTheme() {
    // Remove all theme classes
    themes.forEach(theme => document.body.classList.remove(theme));
    
    // Add current theme class
    if (currentThemeIndex > 0) { // Skip for default theme (index 0)
        document.body.classList.add(themes[currentThemeIndex]);
    }
    
    // Update button text
    const themeNames = ['الافتراضي', 'الفاتح', 'البنفسجي', 'الأزرق الداكن', 'الفخم', 'الحرير الوردي'];
    themeToggle.querySelector('.current-theme').textContent = 
        `الخلفية: ${themeNames[currentThemeIndex]}`;
    
    // Save current theme
    localStorage.setItem('currentThemeIndex', currentThemeIndex);
}

themeToggle.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    updateTheme();
});

// Initialize theme
updateTheme();

// Toggle perfume names list
togglePerfumeList.addEventListener('click', (e) => {
    e.stopPropagation();
    perfumeNamesList.classList.remove('hidden');
    // Add show class after removing hidden to trigger animation
    setTimeout(() => {
        perfumeNamesList.classList.add('show');
    }, 10);
});

// Close perfume names list when clicking outside
document.addEventListener('click', (e) => {
    if (!perfumeNamesList.contains(e.target) && !togglePerfumeList.contains(e.target)) {
        perfumeNamesList.classList.remove('show');
        // Wait for animation to complete before hiding
        setTimeout(() => {
            perfumeNamesList.classList.add('hidden');
        }, 300);
    }
});

// Prevent closing when clicking inside the list
perfumeNamesList.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Save new perfume name
savePerfumeNameBtn.addEventListener('click', () => {
    const name = newPerfumeNameInput.value.trim();
    if (!name) return;
    
    // Check if name already exists in perfumes list
    if (perfumes.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('هذا العطر موجود مسبقاً في قائمة العطور المضافة!');
        return;
    }
    
    // Check if name already exists in saved names
    if (perfumeNames.some(savedName => savedName.toLowerCase() === name.toLowerCase())) {
        alert('هذا الاسم موجود مسبقاً في قائمة الأسماء المحفوظة!');
        return;
    }
    
    perfumeNames.push(name);
    localStorage.setItem('perfumeNames', JSON.stringify(perfumeNames));
    updatePerfumeNamesList();
    newPerfumeNameInput.value = '';
}); 

// Update perfume names list
function updatePerfumeNamesList() {
    savedPerfumeNamesList.innerHTML = '';
    perfumeNames.forEach(name => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="name-item-container">
                <input type="checkbox" class="name-checkbox" value="${name}">
                <span class="perfume-name-item" style="cursor: pointer">${name}</span>
            </div>
            <button class="delete-name-btn" onclick="deletePerfumeName('${name}')">×</button>
        `;
        
        // Add click event to the name
        const nameSpan = li.querySelector('.perfume-name-item');
        nameSpan.addEventListener('click', () => {
            // Fill the name in the new perfume form
            document.getElementById('perfumeName').value = name;
            // Hide the names list
            perfumeNamesList.classList.add('hidden');
            // Scroll to the form
            document.getElementById('perfumeForm').scrollIntoView({ behavior: 'smooth' });
            // Focus on the next input field (ingredients)
            document.getElementById('perfumeIngredients').focus();
        });
        
        savedPerfumeNamesList.appendChild(li);
    });
}

// Select All Names
selectAllNames.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.name-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
});

// Delete Selected Names
deleteSelectedNames.addEventListener('click', () => {
    const selectedCheckboxes = document.querySelectorAll('.name-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        alert('الرجاء تحديد العطور المراد حذفها');
        return;
    }
    
    if (confirm(`هل أنت متأكد من حذف ${selectedCheckboxes.length} عطر محدد؟`)) {
        const selectedNames = Array.from(selectedCheckboxes).map(cb => cb.value);
        perfumeNames = perfumeNames.filter(name => !selectedNames.includes(name));
        localStorage.setItem('perfumeNames', JSON.stringify(perfumeNames));
        updatePerfumeNamesList();
        selectAllNames.checked = false;
    }
});

// Delete All Names
deleteAllNames.addEventListener('click', () => {
    if (perfumeNames.length === 0) {
        alert('القائمة فارغة بالفعل');
        return;
    }
    
    if (confirm(`هل أنت متأكد من حذف جميع العطور (${perfumeNames.length} عطر)؟`)) {
        perfumeNames = [];
        localStorage.setItem('perfumeNames', JSON.stringify(perfumeNames));
        updatePerfumeNamesList();
        selectAllNames.checked = false;
    }
});

// Style update for the name items
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .perfume-name-item {
        transition: color 0.3s ease;
    }
    .perfume-name-item:hover {
        color: var(--primary-color);
    }
`;
document.head.appendChild(styleSheet);

// Delete perfume name
function deletePerfumeName(name) {
    if (confirm('هل أنت متأكد من حذف هذا الاسم؟')) {
        perfumeNames = perfumeNames.filter(n => n !== name);
        localStorage.setItem('perfumeNames', JSON.stringify(perfumeNames));
        updatePerfumeNamesList();
    }
}

// Initialize perfume names list
updatePerfumeNamesList();

// Check for duplicate perfume names
function isDuplicatePerfume(name, currentId = null) {
    name = name.trim().toLowerCase();
    
    // Check if name exists in saved perfume names list
    if (perfumeNames.some(savedName => savedName.toLowerCase() === name)) {
        alert('هذا العطر موجود مسبقاً في قائمة العطور المحفوظة!');
        return true;
    }
    
    // Check if name exists in perfumes list
    const duplicate = perfumes.find(p => 
        p.name.toLowerCase() === name && p.id !== currentId
    );
    
    if (duplicate) {
        alert('يوجد عطر بنفس الاسم بالفعل! الرجاء اختيار اسم آخر.');
        return true;
    }
    
    return false;
}

// Add input event listener for perfume name
function addPerfumeNameValidation(input, currentId = null) {
    input.addEventListener('input', function() {
        const name = this.value.trim();
        if (name && isDuplicatePerfume(name, currentId)) {
            alert('يوجد عطر بنفس الاسم بالفعل!');
            this.value = '';
        }
    });
}

// Initialize perfume name validation
const perfumeNameInput = document.getElementById('perfumeName');
addPerfumeNameValidation(perfumeNameInput);

// Check for duplicate oil names
function isDuplicateOil(name, container, excludeElement = null) {
    const oilInputs = container.querySelectorAll('.oil-name');
    name = name.trim().toLowerCase();
    
    for (const input of oilInputs) {
        if (input !== excludeElement && input.value.trim().toLowerCase() === name) {
            return true;
        }
    }
    return false;
}

// Add new oil input fields
function createOilInputs(container) {
    const oilGroup = document.createElement('div');
    oilGroup.className = 'oil-item';
    
    const oilInput = document.createElement('input');
    oilInput.type = 'text';
    oilInput.className = 'oil-name';
    oilInput.placeholder = 'اسم الزيت';
    
    // Add event listener for oil name input
    oilInput.addEventListener('input', function() {
        if (isDuplicateOil(this.value, container, this)) {
            alert('هذا الزيت موجود بالفعل!');
            this.value = '';
        }
    });
    
    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.className = 'oil-amount';
    amountInput.placeholder = 'الكمية (مل)';
    amountInput.min = '0';
    
    const dropsInput = document.createElement('input');
    dropsInput.type = 'number';
    dropsInput.className = 'oil-drops';
    dropsInput.placeholder = 'عدد القطرات';
    dropsInput.min = '0';
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-oil';
    removeBtn.onclick = () => oilGroup.remove();
    
    oilGroup.appendChild(oilInput);
    oilGroup.appendChild(amountInput);
    oilGroup.appendChild(dropsInput);
    oilGroup.appendChild(removeBtn);
    
    return oilGroup;
}

addOilBtn.addEventListener('click', () => {
    const oilGroup = createOilInputs(oilsContainer);
    oilsContainer.insertBefore(oilGroup, addOilBtn);
});

// Handle form submission
function handleFormSubmit(e, isEdit = false) {
    e.preventDefault();
    
    const form = isEdit ? editForm : perfumeForm;
    const perfumeName = form.querySelector('#' + (isEdit ? 'editPerfumeName' : 'perfumeName')).value.trim();
    const ingredients = form.querySelector('#' + (isEdit ? 'editIngredients' : 'ingredients')).value;
    const alcoholAmount = form.querySelector('#' + (isEdit ? 'editAlcoholAmount' : 'alcoholAmount')).value;
    const alcoholType = form.querySelector('#' + (isEdit ? 'editAlcoholType' : 'alcoholType')).value;
    
    // Check for duplicate perfume name
    if (isDuplicatePerfume(perfumeName, isEdit ? currentEditId : null)) {
        alert('يوجد عطر بنفس الاسم بالفعل! الرجاء اختيار اسم آخر.');
        return;
    }
    
    // Check for duplicate oils before submission
    const oilInputs = form.querySelectorAll('.oil-name');
    const oilNames = new Set();
    let hasDuplicates = false;
    
    oilInputs.forEach(input => {
        const name = input.value.trim().toLowerCase();
        if (name && oilNames.has(name)) {
            hasDuplicates = true;
        }
        oilNames.add(name);
    });
    
    if (hasDuplicates) {
        alert('يوجد زيوت مكررة! الرجاء التأكد من عدم تكرار أسماء الزيوت.');
        return;
    }
    
    // Collect oils
    const oils = [];
    const oilItems = form.querySelectorAll('.oil-item');
    oilItems.forEach(item => {
        const name = item.querySelector('.oil-name').value;
        const amount = item.querySelector('.oil-amount').value;
        const drops = item.querySelector('.oil-drops').value;
        if (name && (amount || drops)) {
            oils.push({ name, amount, drops });
        }
    });
    
    const perfume = {
        id: isEdit ? currentEditId : Date.now(),
        name: perfumeName,
        ingredients,
        oils,
        alcohol: {
            amount: alcoholAmount,
            type: alcoholType
        },
        createdAt: isEdit ? perfumes.find(p => p.id === currentEditId).createdAt : new Date().toISOString()
    };
    
    if (isEdit) {
        const index = perfumes.findIndex(p => p.id === currentEditId);
        perfumes[index] = perfume;
        editModal.style.display = 'none';
    } else {
        perfumes.unshift(perfume);
        form.reset();
        form.querySelectorAll('.oil-item').forEach(item => item.remove());
    }
    
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    displayPerfumes();
}

perfumeForm.addEventListener('submit', e => handleFormSubmit(e, false));
editForm.addEventListener('submit', e => handleFormSubmit(e, true));

// Display perfumes
function displayPerfumes() {
    favoritesList.innerHTML = '';
    
    perfumes.forEach((perfume, index) => {
        const card = document.createElement('div');
        card.className = 'perfume-card';
        
        const numberElement = document.createElement('div');
        numberElement.className = 'perfume-number';
        numberElement.textContent = (index + 1).toString();
        card.appendChild(numberElement);
        
        const totalVolume = calculateTotalVolume(perfume);
        
        card.innerHTML += `
            <div class="card-actions">
                <button class="edit-btn" onclick="editPerfume(${perfume.id})">تعديل</button>
                <button class="delete-btn" onclick="deletePerfume(${perfume.id})">حذف</button>
            </div>
            <h3>${perfume.name}</h3>
            <p>المكونات: ${perfume.ingredients}</p>
            <div class="oils">
                ${perfume.oils.map(oil => 
                    `<span class="oil-tag">${oil.name}: ${oil.amount || '0'} مل | ${oil.drops || '0'} قطرة</span>`
                ).join('')}
            </div>
            <p>كمية الكحول: ${perfume.alcohol.amount} مل</p>
            <p>ماء مقطر: ${perfume.alcohol.type}</p>
            <p>الحجم الكلي: ${totalVolume} مل</p>
        `;
        
        favoritesList.appendChild(card);
    });
}

// Calculate total volume of perfume
function calculateTotalVolume(perfume) {
    const oilsVolume = perfume.oils.reduce((sum, oil) => sum + (parseFloat(oil.amount) || 0), 0);
    const alcoholVolume = parseFloat(perfume.alcohol.amount);
    return oilsVolume + alcoholVolume;
}

// Delete single perfume
function deletePerfume(id) {
    if (confirm('هل أنت متأكد من حذف هذا العطر؟')) {
        perfumes = perfumes.filter(p => p.id !== id);
        localStorage.setItem('perfumes', JSON.stringify(perfumes));
        displayPerfumes();
    }
}

// Delete all perfumes
deleteAllBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من حذف جميع العطور؟')) {
        perfumes = [];
        localStorage.setItem('perfumes', JSON.stringify(perfumes));
        displayPerfumes();
    }
});

// Edit perfume
function editPerfume(id) {
    currentEditId = id;
    const perfume = perfumes.find(p => p.id === id);
    
    // Create edit form content
    editForm.innerHTML = `
        <div class="form-group">
            <label for="editPerfumeName">اسم العطر</label>
            <input type="text" id="editPerfumeName" value="${perfume.name}" required>
        </div>

        <div class="form-group">
            <label for="editIngredients">المكونات</label>
            <textarea id="editIngredients" rows="4" required>${perfume.ingredients}</textarea>
        </div>

        <div class="form-group">
            <label>الزيوت العطرية</label>
            <div class="oils-container" id="editOilsContainer">
                ${perfume.oils.map(oil => `
                    <div class="oil-item">
                        <input type="text" class="oil-name" value="${oil.name}" placeholder="اسم الزيت">
                        <input type="number" class="oil-amount" value="${oil.amount || ''}" placeholder="الكمية (مل)" min="0">
                        <input type="number" class="oil-drops" value="${oil.drops || ''}" placeholder="عدد القطرات" min="0">
                        <button type="button" class="remove-oil" onclick="this.parentElement.remove()">×</button>
                    </div>
                `).join('')}
                <button type="button" class="add-oil" onclick="addEditOil()">+</button>
            </div>
        </div>

        <div class="form-group">
            <label for="editAlcoholAmount">كمية الكحول (مل)</label>
            <input type="number" id="editAlcoholAmount" value="${perfume.alcohol.amount}" min="0" required>
        </div>

        <div class="form-group">
            <label for="editAlcoholType">ماء مقطر</label>
            <input type="text" id="editAlcoholType" value="${perfume.alcohol.type}" required>
        </div>

        <button type="submit" class="submit-btn">حفظ التعديلات</button>
    `;
    
    // Add validation to edit form perfume name
    const editPerfumeNameInput = document.getElementById('editPerfumeName');
    addPerfumeNameValidation(editPerfumeNameInput, currentEditId);
    
    // Add event listeners to oil name inputs
    const container = document.getElementById('editOilsContainer');
    container.querySelectorAll('.oil-name').forEach(input => {
        input.addEventListener('input', function() {
            if (isDuplicateOil(this.value, container, this)) {
                alert('هذا الزيت موجود بالفعل!');
                this.value = '';
            }
        });
    });
    
    editModal.style.display = 'block';
}

// Add oil in edit mode
function addEditOil() {
    const container = document.querySelector('#editOilsContainer');
    const addBtn = container.querySelector('.add-oil');
    const oilGroup = createOilInputs(container);
    container.insertBefore(oilGroup, addBtn);
}

// Close modal
closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Initial display
displayPerfumes();
