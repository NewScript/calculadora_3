export default function subtraction(values){
    const firstValue = Number(values[0]) 
    const secondValue = Number(values[1])
    if(Number.isNaN(firstValue) || Number.isNaN(secondValue) ){
        throw new Error('Valor inválido')
        return
    }
    try {
        return firstValue - secondValue
    } catch (error) {
        throw new Error('Erro ao realizar a subtração');
    }
};