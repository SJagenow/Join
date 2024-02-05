

let todo = [{
    'id': 0,
    'label': 'User Story',
    'title': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation...',
    'category': 'open'
},
{
    'id': 1,
    'label': 'User',
    'title': 'Kochwelt Recommender',
    'description': 'Build start ..',
    'category': 'done'
},

{
    'id': 2,
    'label': 'User',
    'title': 'Kochwelt Recommender',
    'description': 'Build start ..',
    'category': 'closed'
},

{
    'id': 3,
    'label': 'User',
    'title': 'Kochwelt Recommender',
    'description': 'Build start ..',
    'category': 'await'
},
];


let currentDraggedElement;


let progress = [];
let feedback = [];
let done = [];



function updateBoard() {
    let open = todo.filter(t => t['category'] == 'open');

    document.getElementById('todo_content_open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const clean = open[index];
        document.getElementById('todo_content_open').innerHTML += generateTodo(clean);
    }


    let closed = todo.filter(t => t['category'] == 'closed');

    document.getElementById('close_one').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const clean = closed[index];
        document.getElementById('close_one').innerHTML += generateTodo(clean);
    }

    
    let awaitList = todo.filter(t => t['category'] == 'await');

    document.getElementById('await_content').innerHTML = '';

    for (let index = 0; index < awaitList.length; index++) {
        const clean = awaitList[index];
        document.getElementById('await_content').innerHTML += generateTodo(clean);
    }

    let doneList = todo.filter(t => t['category'] == 'done');

    document.getElementById('done_content').innerHTML = '';

    for (let index = 0; index < doneList.length; index++) {
        const clean = doneList[index];
        document.getElementById('done_content').innerHTML += generateTodo(clean);
    }

}

function startDragging(id) {
    currentDraggedElement = id;
}




function generateTodo(clean) {
    return `<div draggable="true" ondragstart="startDragging(${clean['id']})" class="todo">${clean['label']} <div>${clean['title']}</div><div>${clean['description']}</div></div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todo[currentDraggedElement]['category'] = category;
    updateBoard();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}