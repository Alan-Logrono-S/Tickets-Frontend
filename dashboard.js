const API_URL = "'http://localhost:4000/api";

let globalClientes=[], globalTecnicos=[], globalTickets=[];

document.addEventListener('DOMContentLoaded', async ()=>{
    usuario = JSON.parse(localStorage.getItem('usuario'));
    if(!usuario) return window.location.href = 'index.html';

    document.getElementById('bienvenida-user').textContent = `Bienvenido ${usuario.nombre} ${usuario.apellido}`;
    await obtenerTodo();
});

async function obtenerTodo() {
    await listarClientes();
    await listarTecnicos();
    await listarTickets();
};

//CLIENTES

async function listarClientes() {
    globalClientes = await( await fetch(`${API_URL}/clientes`)).json();

    document.getElementById('tabla-clientes').innerHTML = globalClientes.map(cli => `
        <tr>
            <td>${cli.cedula}</td>
            <td>${cli.nombre}</td>
            <td>${cli.apellido}</td>
            <td>${cli.ciudad}</td>
            <td>${cli.email}</td>
            <td>${cli.direccion}</td>
            <td>${cli.telefono}</td>
            <td>${cli.fecha_nacimiento ? cli.fecha_nacimiento.split('') [0]: 'S/F'}</td>
            <td>${cli.dependencia}</td>

            <td>
                <button id="btn-edit" onClick="agregarClientes('${cli._id}')">Editar</button>
                <button id="btn-delete" onClick="eliminar('clientes','${cli._id}')">Eliminar</button>
            </td>
        </tr>`
    ).join('');

    document.getElementById('tic-cliente').innerHTML = '<option value="">Seleccionar Cliente</option>' + 
    globalClientes.map(c => `<option value="${c._id}">${c.nombre} ${c.apellido}</option>`).join('')
    
};

document.getElementById('form-clientes').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const id= document.getElementById('cli._id').value;
    const body = {
        cedula : document.getElementById('cli-cedula').value,
        nombre : document.getElementById('cli-nombre').value,
        apellido : document.getElementById('cli-apellido').value,
        ciudad : document.getElementById('cli-ciudad').value,
        email : document.getElementById('cli-email').value,
        direccion : document.getElementById('cli-direccion').value,
        telefono : document.getElementById('cli-telefono').value,
        fecha_nacimiento : document.getElementById('cli-fecha').value,
        dependencia : document.getElementById('cli-dependencia').value,
    }

    await fetch(`${API_URL}/clientes${id ? '/'+id : ''}`,{
        method: id ? 'PUT' : 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
    });

    e.target.reset();
    document.getElementById('cli._id').value = '';
    await obtenerTodo();
});

function agregarClientes(id){
    const c = globalClientes.find(x => x._id === id);
    if(!c) return
    document.getElementById('cli._id').value = c._id;
    document.getElementById('cli-cedula').value = c.cedula;
    document.getElementById('cli-nombre').value = c.nombre;
    document.getElementById('cli-apellido').value = c.apellido;
    document.getElementById('cli-ciudad').value = c.ciudad;
    document.getElementById('cli-email').value = c.email;
    document.getElementById('cli-direccion').value = c.direccion;
    document.getElementById('cli-telefono').value = c.telefono;
    document.getElementById('cli-fecha').value = c.fecha_nacimiento ? c.fecha_nacimiento.split('T') [0] : '';
    document.getElementById('cli-dependencia').value = c.dependencia;

    window.scrollTo(0,0);
};









// FUNCIONES

async function eliminar(entidad, id) {
    if(confirm('¿Eliminar Informacion?')){
        await fetch(`${API_URL}/${entidad}/${id}`,{
            method: 'DELETE'
        });
    };
    await obtenerTodo();
};

function seleccionar(id){
    document.querySelectorAll('.modulo').find(m => m.style.display ='none');
    document.getElementById(`sec-${id}`).style.display = 'block';
};

function logout(){
    localStorage.clear();
    window.location.href = 'index.html'
}