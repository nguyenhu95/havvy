import {useState} from 'react';
import { 
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Touchable
} from 'react-native';

type Props = {
    onLoginSuccess: () => void;
    onSignUpPress: () => void;
};

export default function LoginScreen({ onLoginSuccess, onSignUpPress }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


// ----------------------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------------------
/**
   * This function runs when the user taps "Sign In".
   * 
   * Right now, it's a placeholder. In Phase 1 Week 5-6 of your plan,
   * you'll connect this to Supabase for real authentication.
   * 
   * The 'async' keyword means this function can wait for things
   * (like network requests) without blocking the app.
   */

    const handleLogin = async () => {
        // Clear any previous errors
        setError('');
        // Basic validation - check if fields are filled
        if (!username.trim()) {
            setError('Please enter your username.');
            return; // Stop here, don't continue
        }
        if (!password) {
            setError('Please enter your password.');
            return; // Stop here, don't continue
        }
        // Simulate loading state
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            // For now, we'll just check if username and password match hardcoded values
            if (username === 'testuser' && password === 'password123') {
                onLoginSuccess(); // Call the success callback
            } else {
                setError('Invalid username or password. Please try again.');
            }
        }

        catch (err) {
            setError('Login Failed. Please try again later.');
        }
        finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {error ? <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text> : null}

                <Text>Username</Text>
                <TextInput 
                    style={styles.username}
                    placeholderTextColor="#94a3b8"
                    placeholder="Email"
                    value={username}
                    onChangeText={newText => setUsername(newText)}
                    keyboardType="email-address" />
                <Text>Password</Text>
                <TextInput
                    style={styles.username} 
                    placeholder="Password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={password}
                    onChangeText={newText => setPassword(newText)} />
                <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={styles.button}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    username: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        width: '80%',
        marginBottom: 8,
        paddingHorizontal: 12,
        color: '#333',
    },
    button: {
        backgroundColor: '#0d9488',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    }
});