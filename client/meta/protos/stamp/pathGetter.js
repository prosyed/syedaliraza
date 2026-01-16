y = Object.values(document.getElementsByClassName('stroke'))
y.forEach(s => {
    console.log(s.id, s.getTotalLength())
})