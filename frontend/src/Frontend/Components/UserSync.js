'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { API_ROUTES } from '@/Frontend/Lib/api';

/**
 * UserSync component
 * This hidden component ensures that the logged-in user's details are
 * always updated in our MongoDB database whenever they access the platform.
 */
export default function UserSync() {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    const userData = {
                        clerkId: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.primaryEmailAddress?.emailAddress,
                        profileImageUrl: user.imageUrl,
                    };

                    await fetch(`${API_ROUTES.USER}/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });
                } catch (error) {
                    console.error('Failed to sync user to database:', error);
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user]);

    return null; // This component doesn't render any UI
}
