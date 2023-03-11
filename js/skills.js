const projects = document.querySelectorAll('.project');
const skillsHeader = document.querySelector('.skills-header');
const skills = document.querySelectorAll('.skills .skill');
let currentSkill = skills[0];

skills.forEach(skill => skill.addEventListener('click', onSkillClick));

function onSkillClick() {
  if (currentSkill) {
    currentSkill.classList.remove('active');
  }

  this.classList.add('active');

  currentSkill = this;

  projects.forEach(project => {
    const clickedSkill = this.textContent.replace(/\u00a0/g, ' '); // меняем &nbsp; на обычный пробел
    const projectSkills = project.getAttribute('skills').split(', ');

    project.classList.remove('visible', 'hidden');

    if (projectSkills.includes(clickedSkill)) {
      project.classList.add('visible');
    } else {
      project.classList.add('hidden');
    }

    // если просто удалять и добавлять класс анимации, то она не перезапускается
    project.style.animation = 'none';
    project.offsetHeight;
    project.style.animation = null;
  });

  const isMobile = window.innerWidth < 762; // такой же метод в цсс

  if (isMobile) {
    skillsHeader.scrollIntoView({ behavior: 'smooth' });
  }
}
