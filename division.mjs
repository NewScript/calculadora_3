export default function division(values){
    const firstValue = Number(values[0]) 
    const secondValue = Number(values[1])
    if(secondValue == 0){
        throw new Error('Não é possivel divisao por zero')
        return
    }
    if(Number.isNaN(firstValue) || Number.isNaN(secondValue) ){
        throw new Error('Valor inválido')
        return
    }
    try {
        return firstValue / secondValue
    } catch (error) {
        throw new Error('Erro ao realizar a divisão')
    }
};