export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long', // Adding weekday looks more "Premium" for events
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};