// I'm doing this because display: flex is buggy with printing, so I'm creating a table instead
window.addEventListener('beforeprint', () => {
  document.title = 'Senya Pugach\'s resume';

  const projects = document.querySelectorAll('.project.resume');

  projects.forEach((project, i) => {
    if (i % 2 === 0) {
      const row = document.createElement('tr');

      project.before(row);

      row.append(project);

      if (projects[i + 1]) {
        row.append(projects[i + 1]);
      }
    }
  });
});

// because I don't want to repair page back :)
window.addEventListener('afterprint', () => {
  location.reload();
});