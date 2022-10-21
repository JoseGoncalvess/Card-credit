//so vai rodar correto se der o comand ( npm run dev) referente  ao uso do vite//

import "./css/index.css"
import IMask, { MaskedDynamic } from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"]
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
//securitcode
const securityCode = document.querySelector("#security-code")
//Criação da mascara e sua regras
const securityCodepattern = {
  mask: "0000"
}
//Aplicaçãod a mascara de fato
const securityCodeMasked = IMask(securityCode, securityCodepattern)

//expirer date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatepattern = {
  mask: "MM{/}YY",
  //não esquecer de add o carinha baixo
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatepattern)

//mask typ card ultilisando regex para valdiadção
const cardNumber = document.querySelector("#card-number")
const cardNumberpattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appemded, dynamicMasked) {
    const number = (dynamicMasked.value + appemded).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberpattern)

const addButtom = document.querySelector("#buttom")

addButtom.addEventListener("click", () => {})
//não executar o evendo padrão derecarregar  apágina
document.querySelector("form").addEventListener("submit", event => {
  event.preventDefault()
})
//Colocando o nome do titular do cartão
const cardHolder = document.querySelector("#card-holder")

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  //cOM ESSA FUNÇÃO IFTERNARIO PERGUNDO SE ESTA VAZIO TANO O CONTEUDO QUANTO O VALOR E CASA NÃO (:) RETORNO O VALOR DIGITADO.
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//função para adição do nuber se segurança, passanso uma funça sparada a arow function
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode(code) {
  const ccSecuryt = document.querySelector(".cc-security .value")
  ccSecuryt.innerText = code.length === 0 ? "123" : code
}

//função de prenenchimento de nuber do cartão, semelhante a de cvc acima
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  updateCardnumber(cardNumberMasked.value)
  setCardType(cardType)
})
function updateCardnumber(code) {
  const cardnumber = document.querySelector(".cc-number")
  cardnumber.innerText = code.length === 0 ? "1234 5678 9012 3456" : code
}

//expiration  atualizada mediante função diante de função semelhante as demais
expirationDateMasked.on("accept", () => {
  setCardType("visa")
  updateexpiration(expirationDateMasked.value)
})
function updateexpiration(date) {
  const expiration = document.querySelector(".cc-extra .cc-expiration .value")
  expiration.innerText = date.length === 0 ? "00/00" : date
}
