import operations from './operations.mjs';

//--------------------------------------------------------

const viewCalculation = {
    calculationFormulation: document.getElementById('calculationFormulation'),
    numberPresentation: document.getElementById('numberPresentation')
};

const action = {
    allClear: document.getElementById('allClear'),
    clear: document.getElementById('clear'),
    backSpace: document.getElementById('backSpace')
};

const operators = {
    sum: document.getElementById('sum'),
    subtraction: document.getElementById('subtraction'),
    division: document.getElementById('division'),
    multiplication: document.getElementById('multiplication'),
    result: document.getElementById('result')
};

const operand = document.getElementsByClassName('operand');

const signalChange = document.getElementById('signalChange');

const comma = document.getElementById('comma');

//--------------------------------------------------------


const globalVariables = {
    numberOfCharactersAllowed: 10,
    formattedNumbers: '',
    values: [],
    operators: [],
    result: [] 
}

const Value = {
    signal: '',
    integer: '',
    comma: '',
    decimal: '',
    toNumber(){
        return `${this.signal}${this.integer}${this.comma}${this.decimal}`
    }
};

//--------------------------------------------------------

function clear (){
    Value.signal = '';
    Value.integer = '';
    Value.comma = '';
    Value.decimal = '';
    presentNumber();
    viewCalculation.numberPresentation.innerText = '0';
}

function clearAll (){
    clear();
    viewCalculation.calculationFormulation.textContent = '0';
    globalVariables.values = []
    globalVariables.operators = []
}

function presentFormulation (event){
    if(viewCalculation.calculationFormulation.textContent === '0'){
        viewCalculation.calculationFormulation.textContent = '';
    }
    viewCalculation.calculationFormulation.textContent += 
        `${viewCalculation.numberPresentation.textContent} ${event.target.innerText} `
}

function addDotBackwards (string) {
    let reversedString = string.split('').reverse().join(''); // inverte a string
    let result = reversedString.replace(/(\d{1,3})/g, '$1.').split('').reverse().join(''); // adiciona um ponto a cada 3 dígitos
    if (result.charAt(0) === '.') { // remove ponto adicional adicionado no início da string
        result = result.slice(1);
    }
    return result;
}

function presentNumber () {
    const valueTemp = addDotBackwards(Value.integer);
    viewCalculation.numberPresentation.textContent = 
        `${Value.signal}${valueTemp}${Value.comma}${Value.decimal}`;
    // console.log(`${Value.signal}${Value.integer}${Value.comma}${Value.decimal}`)
}

function bsPresentNumber (){
    let indexOfTheCharacterToBeDeleted = ((viewCalculation.numberPresentation.textContent).length - 1);
    let letterToErase = viewCalculation.numberPresentation.textContent.charAt(indexOfTheCharacterToBeDeleted);
    viewCalculation.numberPresentation.textContent = (viewCalculation.numberPresentation.textContent).slice(0, indexOfTheCharacterToBeDeleted);
    if(indexOfTheCharacterToBeDeleted === 0){
        viewCalculation.numberPresentation.textContent = '0';
    }
    if(letterToErase != ',' || letterToErase != '-' || letterToErase != '.'){
        bsStoreNumber();
    }
    if(letterToErase === ','){
        Value.comma = '';
    }
    if(letterToErase === '-'){
        Value.signal = '';
    }
}

function bsStoreNumber (){
    if(Value.comma){
        Value.decimal = Value.decimal.slice(0, Value.decimal.length - 1);
        // console.log('Decimal = ' + $strDecimal + ' - ' + $strDecimal.length);
    }else{
        Value.integer = Value.integer.slice(0, Value.integer.length - 1);
        // console.log('Integer = ' + $strInteger + ' - ' + $strInteger.length);
    }
}

function maximumNumberOfCharactersAllowedReached () {
    let amountOfCharactersValueInteger = (Value.integer).toString().length;
    let amountOfCharactersValueDecimal = (Value.decimal).toString().length;
    let totalCaracters = amountOfCharactersValueInteger + amountOfCharactersValueDecimal;
    return totalCaracters >= globalVariables.numberOfCharactersAllowed ? true : false;
}

function includeNumber (event) {
    const numberClicked = event.target.innerHTML;
    // console.log(numberClicked)
    if (!maximumNumberOfCharactersAllowedReached()) {
        if (Value.comma === '') {
            Value.integer = Value.integer + numberClicked;
            presentNumber();
        } else {
            Value.decimal = Value.decimal + numberClicked;
            presentNumber();
        }
    } else {
        alert('Número máximo de caracteres permitidos alcançado');
    }
}

function includeNumbers(){
    globalVariables.values.push(Value.toNumber())
    clear()
}

function includeOperator(event){
  const selectedOperator = event.target.id
  globalVariables.operators.push(selectedOperator)
  presentFormulation(event)
  includeNumbers()
}

function changeSign () {
  switch(Value.signal){
  case '':
      Value.signal = '-';
      break;
  case '-':
      Value.signal = '+';
      break;
  case '+':
      Value.signal = '-';
      break; 
  }
  presentNumber();
}

function includeComma () {
    Value.comma = ',';
    presentNumber();
}

function calculateExpression(event){
    presentFormulation(event)
    includeNumbers()
    // console.log(globalVariables.values, globalVariables.operators)
    calculate()
}

function calculate(){
    const temporaryValues = globalVariables.values.map(element => {
        return element.replace(',','.')
    })

    const capturingIndexesPreviousOperations = []
    globalVariables.operators.forEach((element, index) => {
        if(element === 'multiplication' || element === 'division'){
            capturingIndexesPreviousOperations.push(index)
        }
    })

    console.log('-----')

    console.log(temporaryValues, capturingIndexesPreviousOperations)
    
    for(let i = 0; i < capturingIndexesPreviousOperations.length; i++){
        console.log(globalVariables.operators[capturingIndexesPreviousOperations[i]])
    }

    for(let i = 0; i < capturingIndexesPreviousOperations.length; i++){
        console.log(`operations[${globalVariables.operators[capturingIndexesPreviousOperations[i]]}]`)
        console.log(`Parâmetros: (${temporaryValues[capturingIndexesPreviousOperations[i]]}, ${temporaryValues[capturingIndexesPreviousOperations[i]+1]})`)
    }

    console.log('-----')

    console.log(temporaryValues)
    
    for(let i = 0; i < capturingIndexesPreviousOperations.length; i++){
        let parametros = []
        let operation = globalVariables.operators[capturingIndexesPreviousOperations[i]]
        parametros = (`${temporaryValues[capturingIndexesPreviousOperations[i]]},
                        ${temporaryValues[capturingIndexesPreviousOperations[i]+1]}`)
                        .split(',')
        globalVariables.result.push(operations[operation](parametros))
    }

    for(let i = 0; i < capturingIndexesPreviousOperations.length; i++){
        if(i === 0){
            temporaryValues.splice(capturingIndexesPreviousOperations[i],2)
            continue
        }
        temporaryValues.splice(capturingIndexesPreviousOperations[i] - (i * 2), 2)
    }



       
    console.log(temporaryValues)

    console.log(globalVariables.result)

}

//--------------------------------------------------------

for (const iterator of operand) {
    iterator.addEventListener('click', includeNumber);
}

signalChange.addEventListener('click', changeSign);

comma.addEventListener('click', includeComma);

action.clear.addEventListener('click', clear);

action.allClear.addEventListener('click', clearAll);

action.backSpace.addEventListener('click', bsPresentNumber);

operators.sum.addEventListener('click', includeOperator);

operators.subtraction.addEventListener('click', includeOperator);

operators.division.addEventListener('click', includeOperator);

operators.multiplication.addEventListener('click', includeOperator);

operators.result.addEventListener('click', calculateExpression)

//--------------------------------------------------------

