
function myTag(strings, personExp, ageExp) {
  console.log('arguments', arguments)
  // const str0 = strings[0]; // "That "
  // const str1 = strings[1]; // " is a "
  // const str2 = strings[2]; // "."

  // const ageStr = ageExp > 99 ? "centenarian" : "youngster";

  // // We can even return a string built using a template literal
  // return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

const html = `
<div id="present-on-load">Present on page load</div>
<div id="added-after-delay" style="color:orange">Added after ${asyncLoadDelay} ms
  <span id="added-after-2x-delay" style="color:red">Added after 2x ${asyncLoadDelay} ms</span> /* delay: ${asyncLoadDelay*2} /*
</div>  /* delay: ${asyncLoadDelay} /*
`

cy.mount(html)
