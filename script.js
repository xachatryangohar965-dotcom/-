
const people = [
{name:'Մեծ աղջիկ',mass:40,skin:'#f2bd91',hair:'#5c3428',shirt:'#f17e83',style:0},
{name:'Տղա',mass:30,skin:'#e7ae80',hair:'#493027',shirt:'#438de0',style:1},
{name:'Փոքր աղջիկ',mass:20,skin:'#f3c69f',hair:'#8a4a2b',shirt:'#f2b84b',style:2},
{name:'Փոքր տղա',mass:15,skin:'#d99a70',hair:'#3e2b26',shirt:'#64b77f',style:1},
{name:'Տատիկ',mass:55,skin:'#efc6a5',hair:'#e5e1d8',shirt:'#9b78bd',style:3},
{name:'Պապիկ',mass:60,skin:'#e7b48e',hair:'#ddd9ce',shirt:'#5c7f9c',style:4},
{name:'Երիտասարդ',mass:70,skin:'#c98962',hair:'#34251f',shirt:'#dc8b46',style:1},
{name:'Մեծահասակ',mass:80,skin:'#efbd98',hair:'#34251f',shirt:'#5b8a83',style:4}
];

let selected = {left:0,right:4};
let score = 0;
let rounds = 0;

const $ = id => document.getElementById(id);

function svgPerson(p) {
let hair = p.style===3 || p.style===4
? `<path d="M21 48 Q14 9 50 8 Q87 8 79 51 L72 37 Q68 20 50 21 Q29 20 27 42Z" fill="${p.hair}"/>`
: `<path d="M19 48 Q12 8 49 9 Q87 8 82 49 L76 35 Q66 18 48 21 Q29 19 24 43Z" fill="${p.hair}"/>`;

let glasses = p.style>=3
? '<g fill="none" stroke="#56616a" stroke-width="2.5"><circle cx="39" cy="48" r="9"/><circle cx="61" cy="48" r="9"/><path d="M48 48h4"/></g>'
: '<g fill="#47332d"><circle cx="39" cy="48" r="2.4"/><circle cx="61" cy="48" r="2.4"/></g>';

return `<ellipse cx="50" cy="104" rx="31" ry="5" fill="#23394b" opacity=".12"/>
<path d="M20 107 Q21 76 31 71 L50 66 L69 71 Q80 79 81 107Z" fill="${p.shirt}"/>
<path d="M37 70 L50 82 L63 70" fill="#fff" opacity=".65"/>
<rect x="43" y="60" width="14" height="15" rx="6" fill="${p.skin}"/>
<ellipse cx="50" cy="45" rx="28" ry="32" fill="${p.skin}"/>
${hair}
<path d="M24 39 Q19 51 25 61" stroke="${p.hair}" stroke-width="7" stroke-linecap="round" fill="none"/>
${glasses}
<path d="M43 61 Q50 67 57 61" stroke="#a85d58" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="29" cy="54" r="4" fill="#e98b83" opacity=".45"/>
<circle cx="71" cy="54" r="4" fill="#e98b83" opacity=".45"/>`;
}

function renderSide(side) {
let p = people[selected[side]];

$(side+'Avatar').innerHTML = svgPerson(p);
$(side+'Name').textContent = p.name;
$(side+'Weight').textContent = p.mass+' կգ';
$(side+'Select').value = selected[side];

update();
}

function choose(side,index) {
selected[side] = (index+people.length)%people.length;
renderSide(side);
$('status').textContent = 'Կերպարը փոխված է․ կարգավորի՛ր հեռավորությունը։';
}

['left','right'].forEach(side => {
let sel = $(side+'Select');

people.forEach((p,i) => {
let o = document.createElement('option');
o.value = i;
o.textContent = `${p.name} · ${p.mass} կգ`;
sel.appendChild(o);
});

sel.onchange = () => choose(side,+sel.value);

$(side+'Prev').onclick = () => choose(side,selected[side]-1);
$(side+'Next').onclick = () => choose(side,selected[side]+1);
$(side+'Range').oninput = update;
});

function update() {
let ld = +$('leftRange').value;
let rd = +$('rightRange').value;

let lm = people[selected.left].mass;
let rm = people[selected.right].mass;

let a = ld*lm;
let b = rd*rm;

$('leftOut').textContent = ld+' սմ';
$('rightOut').textContent = rd+' սմ';

$('leftMoment').textContent = a.toLocaleString('en-US');
$('rightMoment').textContent = b.toLocaleString('en-US');

let tilt = Math.max(-13,Math.min(13,(b-a)/Math.max(a,b)*26));

$('beam').style.transform = `rotate(${tilt}deg)`;
}

function check() {
let a = people[selected.left].mass*+$('leftRange').value;
let b = people[selected.right].mass*+$('rightRange').value;

rounds++;

$('rounds').textContent = rounds;
$('level').textContent = 'ՓՈՒԼ '+String(rounds+1).padStart(2,'0');

if(Math.abs(a-b)<=Math.max(a,b)*.015) {
score++;

$('score').textContent = score;
$('status').textContent = '✨ ՃԻՇՏ Է․ երկու կողմերը հավասարակշռվեցին։';
$('status').style.background = '#e6f7eb';
$('status').style.color = '#278354';

$('winModal').classList.add('show');

} else {

$('status').textContent =
(a>b?'Ձախ կողմն է ծանր։':'Աջ կողմն է ծանր։')+
' Փորձի՛ր փոխել հեռավորությունները։';

$('status').style.background = '#fff1e5';
$('status').style.color = '#b16b32';
}
}

$('check').onclick = check;

$('hint').onclick = () => {
let a = people[selected.left].mass*+$('leftRange').value;
let b = people[selected.right].mass*+$('rightRange').value;

$('status').textContent = a>b
? 'Հուշում․ ձախ կողմը ծանր է․ ձախ նստատեղը մոտեցրո՛ւ կենտրոնին կամ աջը հեռացրո՛ւ։'
: 'Հուշում․ աջ կողմը ծանր է․ աջ նստատեղը մոտեցրո՛ւ կենտրոնին կամ ձախը հեռացրո՛ւ։';
};

$('reset').onclick = () => {
$('leftRange').value = 60;
$('rightRange').value = 44;

$('status').textContent = 'Փորձի՛ր հավասարակշռել երկու կողմերը։';
$('status').style.background = '#eef8f1';
$('status').style.color = '#438b64';

update();
};

$('continue').onclick = () => {
$('winModal').classList.remove('show');
$('status').textContent = 'Հաջորդ փուլը պատրաստ է․ ընտրի՛ր նոր կերպարներ։';
};

people.forEach((p,i) => {
let b = document.createElement('button');

b.className = 'character';

b.innerHTML = `
<svg class="avatar" viewBox="0 0 100 110">
${svgPerson(p)}
</svg>
<b>${p.name}</b>
<small>${p.mass} կգ</small>
`;

b.onclick = () => {
let side = window.pickSide || 'left';

choose(side,i);

window.pickSide = side==='left'?'right':'left';

$('status').textContent =
`${p.name} ընտրված է ${side==='left'?'ձախ':'աջ'} կողմում։`;
};

$('characters').appendChild(b);
});

window.pickSide = 'left';

renderSide('left');
renderSide('right');
update();
