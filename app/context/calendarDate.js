import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from './auth'

const CalendarDateContext = createContext();

const CalendarDateProvider = ({ children }) => {
    const currentDate = new Date();
    const selected = currentDate.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(selected);
    const [auth, setAuth] = useAuth()

    useEffect(() => {
        setSelectedDate(selected);
    }, [auth]);


    return (
        <CalendarDateContext.Provider value={[selectedDate, setSelectedDate]}>
            {children}
        </CalendarDateContext.Provider>
    );
};
const useDate = () => useContext(CalendarDateContext);

export { useDate, CalendarDateProvider };