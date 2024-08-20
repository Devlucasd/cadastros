// Funções de utilidade
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Função para exibir seções
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Verificação de login
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
    showSection('profile-section');
    document.getElementById('profile-name').innerText = currentUser.name;
    document.getElementById('profile-hobbies').innerText = currentUser.hobbies.join(', ');
} else {
    showSection('login-section');
}

// Event Listeners para login, cadastro, edição de perfil e exclusão de conta
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = getData('users');

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
    } else {
        alert('Credenciais inválidas');
    }
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const hobbies = document.getElementById('hobbies').value.split(',').map(hobby => hobby.trim());

    const users = getData('users');
    users.push({ name, email, password, hobbies });
    saveData('users', users);

    alert('Cadastro realizado com sucesso!');
    showSection('login-section');
});

document.getElementById('edit-profile').addEventListener('click', function() {
    const newName = prompt('Novo nome:', currentUser.name);
    const newHobbies = prompt('Novos hobbies (separados por vírgula):', currentUser.hobbies.join(', '));

    currentUser.name = newName;
    currentUser.hobbies = newHobbies.split(',').map(hobby => hobby.trim());

    let users = getData('users');
    users = users.map(user => user.email === currentUser.email ? currentUser : user);
    saveData('users', users);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.reload();
});

document.getElementById('delete-profile').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja excluir sua conta?')) {
        let users = getData('users');
        users = users.filter(user => user.email !== currentUser.email);
        saveData('users', users);
        localStorage.removeItem('currentUser');
        window.location.reload();
    }
});

document.getElementById('logout-link').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.reload();
});

// Navegação entre login e cadastro
document.getElementById('register-link').addEventListener('click', function() {
    showSection('register-section');
});

document.getElementById('login-link').addEventListener('click', function() {
    showSection('login-section');
});

// Exibição de grupos e criação de novo grupo
const groups = getData('groups');

function renderGroups() {
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = '';
    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.innerText = group.name;
        groupDiv.addEventListener('click', function() {
            enterChat(group.name);
        });
        groupList.appendChild(groupDiv);
    });
}

renderGroups();

document.getElementById('create-group').addEventListener('click', function() {
    const groupName = prompt('Nome do grupo:');
    if (groupName) {
        groups.push({ name: groupName, messages: [] });
        saveData('groups', groups);
        renderGroups();
    }
});

// Função de chat
function enterChat(groupName) {
    showSection('chat-section');
    document.getElementById('chat-group-name').innerText = groupName;
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    const group = groups.find(g => g.name === groupName);

    group.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.innerText = message;
        chatMessages.appendChild(messageDiv);
    });

    document.getElementById('chat-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const message = document.getElementById('chat-input').value;
        group.messages.push(`${currentUser.name}: ${message}`);
        saveData('groups', groups);

        const messageDiv = document.createElement('div');
        messageDiv.innerText = `${currentUser.name}: ${message}`;
        chatMessages.appendChild(messageDiv);
        document.getElementById('chat-input').value = '';
    });
}

document.getElementById('back-to-groups').addEventListener('click', function() {
    showSection('groups-section');
});
