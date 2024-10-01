//Validation methods for the login modal

/**
 * Runs validation upon the modal upon opening, including regular expressions.
 */
function openModal() {
  var myInput = document.getElementById("signup-psw");
  var confirmMyInput = document.getElementById("cpsw");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");
  var match = document.getElementById("match");

  myInput.onkeyup = function () {

    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var minLength = 8;

    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    if (myInput.value.length >= minLength) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  };

  confirmMyInput.onkeyup = function () {
    if (myInput.value == confirmMyInput.value) {
      match.classList.remove("invalid");
      match.classList.add("valid");
    } else {
      match.classList.remove("valid");
      match.classList.add("invalid");
    }
    enableButton(letter, capital, number, length, match);
  };
}

/**
 * Determines whether to enable a button
 * @param {Element} letter Letter element of the modal
 * @param {Element} capital Capital element of the modal
 * @param {Element} number Number element of the modal
 * @param {Element} length Length element of the modal
 * @param {Element} match Match element of the modal
 */
function enableButton(letter, capital, number, length, match) {
  var button = document.getElementById("my_submit_button");
  var condition = (letter.classList=="valid" && capital.classList=="valid" && number.classList=="valid" && length.classList=="valid" && match.classList=="valid");
  if (condition) {
    button.disabled = false;
  }
}

/**
 * Informs the user that feedback has been submitted
 */
function problemReported() {
  alert("Thank you for your feedback, we will be using this for absolutely nothing");
}