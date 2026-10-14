import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import CardSaldo from "./components/CardSaldo";


interface Transacao {
    id: number;
    descricao: string;
    valor: string | number;
    tipo: 'receita' | 'despesa';
    categoria: string;
    data: string;
}
export default function Dashboard() {
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [saldo, setSaldo] = useState<number>(0);
    const [receitas, setReceitas] = useState<number>(0);
    const [despesas, setDespesas] = useState<number>(0);

    const API_URL = "http://10.141.249.29:8000/api/transacao";

    function calcularTotais(dados: Transacao[]): void {
        let totalReceitas = 0;
        let totalDespesas = 0;

        dados.forEach((item) => {
            const valorNumerico = typeof item.valor === 'number' ? item.valor : parseFloat(item.valor);
            if (item.tipo === 'receita') {
                totalReceitas += valorNumerico;
            } else {
                totalDespesas += valorNumerico;
            }
        });

        setReceitas(totalReceitas);
        setDespesas(totalDespesas);
        setSaldo(totalReceitas - totalDespesas);

    }

    async function carregarTransacoes(): Promise<void> {
        try {
            setCarregando(true);
            const resposta = await fetch(API_URL);
            const dados: Transacao[] = await resposta.json();
            setTransacoes(dados);
            calcularTotais(dados);
        } catch (erro) {
            console.log("Erro ao carregar lançamentos:", erro);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarTransacoes();
    }, []);

    return (
        <View style={styles.container}>

            <View style={styles.cardSaldo}>
                <Text style={styles.labelSaldo}>Saldo Total</Text>
                <Text style={styles.valorSaldo}>R$ {saldo.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
                <CardSaldo titulo="Receitas" valor={`R$ ${receitas.toFixed(2)}`} corFundo="#1B5E20" />
                <CardSaldo titulo="Despesas" valor={`R$ ${despesas.toFixed(2)}`} corFundo="#B71C1C" />
            </View>

            <Text style={styles.tituloExtrato}>Extrato Financeiro</Text>

            {carregando ? (<ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={transacoes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemCard}>
                            <View>
                            <Text style={styles.descricao}>{item.descricao}</Text>
                            <Text style={styles.categoria}>{item.categoria} - {item.data}</Text>
                        </View>
                        <Text style={item.tipo === 'receita' ? styles.valorReceita : styles.valorDespesa}>
                            {item.tipo === 'receita' ? '+ ' : '- '} R$ {(typeof item.valor === 'number' ? item.valor : parseFloat(item.valor)).toFixed(2)}

                        </Text>
                        </View>
                    )}
                    />
                    )}
        </View>


    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f5f5f5',paddingTop: 50},
    cardSaldo: {backgroundColor: '#2196F3', padding: 20, borderRadius: 12, marginBottom: 15},
    labelSaldo: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    valorSaldo: {color: '#fff', fontSize: 28, fontWeight: 'bold',marginTop: 5},
    row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20,gap: 12},
    tituloExtrato: {fontSize: 18, fontWeight: 'bold', marginBottom: 20,color: '#333'},
    itemCard: {backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',},
    descricao: {fontSize: 16, fontWeight: 'bold', color: '#333'},
    categoria: {fontSize: 12, color: '#666', marginTop: 4},
    valorReceita: {fontSize: 16, color: '#4CAF50', fontWeight: 'bold'},
    valorDespesa: {fontSize: 16, color: '#F44336', fontWeight: 'bold'},
});

