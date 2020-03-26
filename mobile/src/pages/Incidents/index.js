import React, {useEffect, useState} from "react";
import {Feather} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {View, FlatList, Image, Text, TouchableOpacity} from "react-native";
import api from "../../services/api";

import logoImg from "../../assets/logo.png"

import styles from "./styles";

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    function navigateToDetail(incident) {
        navigation.navigate('Detail', {incident});
    }

    async function loadIncidents() {
        if (loading) {
            return;
        }

        if (total > 0 && incidents.length === 0) {
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {params: {page}});

        setLoading(false);
        setIncidents([...incidents, ...response.data]);
        setPage(page + 1);
        setTotal(response.headers['x-total-count']);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logoImg}/>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
                </Text>
            </View>

            <Text style={styles.title}>Bem vindo</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve-o.</Text>

            <FlatList
                onEndReached={loadIncidents}
                onEndReachedTreshold={0.20}
                style={styles.incidentList}
                data={incidents}
                showsVerticalScrollIndicator={false}
                renderItem={({item: incident}) =>
                    <View keyExtractor={incident => String(incident.id)} style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{
                            Intl.NumberFormat('pt-BR',
                                {
                                    style: 'currency',
                                    currency: 'BRL'
                                }
                            ).format(incident.value)}</Text>

                        <TouchableOpacity style={styles.detailButton} onPress={() => navigateToDetail(incident)}>
                            <Text style={styles.detailButtonText}>Ver mais</Text>
                            <Feather name="arrow-right" size={16} color="#e02041"/>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}
