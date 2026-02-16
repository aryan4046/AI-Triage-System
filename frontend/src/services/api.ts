
export const API_BASE_URL = 'http://127.0.0.1:5000';

export interface TriageResponse {
    mode: 'medical' | 'chat';
    reply?: string;
    symptoms?: string[];
    risk?: string;
    doctor?: string;
    advice?: string;
    severity?: number;
    recommended_doctors?: any[];
}

export const api = {
    async triage(message: string, userId?: number): Promise<TriageResponse> {
        try {
            // Fallback to non-streaming response structure if needed, or just warn
            console.warn("Using legacy triage call. Use triageStream for realtime updates.");
            const response = await fetch(`${API_BASE_URL}/triage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, user_id: userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error calling triage API:', error);
            throw error;
        }
    },

    async triageStream(
        message: string,
        onChunk: (data: any) => void,
        userId?: number
    ): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/triage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, user_id: userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('Response body is unavailable');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            onChunk(data);
                        } catch (e) {
                            console.error('Error parsing JSON chunk', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error calling triage stream API:', error);
            throw error;
        }
    },

    async login(data: any): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Login failed');
        }
        return response.json();
    },

    async signup(data: any): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Signup failed');
        }
        return response.json();
    },

    async getQueue(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/queue`);
        if (!response.ok) throw new Error('Failed to fetch queue');
        return response.json();
    },

    async getRecommendations(symptoms: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms }),
            });
            if (!response.ok) throw new Error('Failed to fetch recommendations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
    },
};
