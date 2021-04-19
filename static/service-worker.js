self.addEventListener("push", e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "https://cdn.dribbble.com/users/76377/screenshots/2910704/xd.gif"
  });
});