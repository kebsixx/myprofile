const projects = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Project 1",
    imageSrc: "https://images.unsplash.com/photo-1768772123991-b17e721119a7",
    githubUrl: "https://github.com/username/project1",
    demoUrl: "https://demo1.example.com",
    description: "Deskripsi project 1.",
    date: "2026-01-01",
    stats: { likes: 10, comments: 2, reposts: 1, shares: 0 },
    comments: [
      { id: 1, user: "userA", date: "2026-01-02", text: "Keren!" },
      { id: 2, user: "userB", date: "2026-01-03", text: "Mantap!" },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Project 2",
    imageSrc: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    githubUrl: "https://github.com/username/project2",
    demoUrl: "https://demo2.example.com",
    description: "Deskripsi project 2.",
    date: "2026-01-10",
    stats: { likes: 5, comments: 0, reposts: 0, shares: 1 },
    comments: [],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Project 3",
    imageSrc:
      "https://images.unsplash.com/photo-1768291424878-3dbd4118d23d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
    githubUrl: "https://github.com/username/project3",
    demoUrl: "https://demo3.example.com",
    description: "Deskripsi project 3.",
    date: "2026-02-15",
    stats: { likes: 20, comments: 5, reposts: 3, shares: 2 },
    comments: [
      { id: 1, user: "userC", date: "2026-02-16", text: "Luar biasa!" },
      { id: 2, user: "userD", date: "2026-02-17", text: "Inspiratif!" },
    ],
  },
];

export default projects;
