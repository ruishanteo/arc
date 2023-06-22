export const styles = {
    chatWithMeButton: {
        cursor: 'pointer',
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
        // Border
        borderRadius: '50%',
        // Background 
        backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/arc-backend-bac77.appspot.com/o/GuCM6dhsBNfIyFxGAQPR2IYKOmq1.png?alt=media&token=e78fd915-0a19-40a0-aa83-cab7741f1e91)`, 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '84px',
        // Size
        width: '84px',
        height: '84px',
    },
    avatarHello: { 
        // Position
        position: 'absolute', 
        left: 'calc(-100% - 44px - 28px)', 
        top: 'calc(50% - 24px)', 
        // Layering
        zIndex: '10000',
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
        // Border
        padding: '12px 12px 12px 16px',
        borderRadius: '24px', 
        // Color
        backgroundColor: '#DFD1F5',
        color: 'black',
    },
    supportWindow: {
        // Position
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        left: '24px',
        // Size
        width: '100%',
        height: '100%',
        maxWidth: 'calc(100% - 48px)',
        maxHeight: 'calc(100% - 48px)',
        backgroundColor: 'white',
        // Border
        borderRadius: '12px',
        border: `2px solid #DFD1F5`,
        overflow: 'hidden',
        // Shadow
        boxShadow: '0px 0px 16px 6px rgba(0, 0, 0, 0.33)',
    },
    emailFormWindow: { 
        width: '100%',  
        overflow: 'hidden',
        transition: "all 0.5s ease",
        WebkitTransition: "all 0.5s ease",
        MozTransition: "all 0.5s ease",
    },
    stripe: {
        position: 'relative',
        top: '-185px',
        width: '100%',
        height: '400px',
        backgroundColor: '#E0FBFF',
        transform: 'skewY(-12deg)',
    },
    topText: { 
        position: 'relative',
        width: '100%', 
        top: '5%', 
        color: 'black', 
        fontSize: '30px', 
        fontWeight: '600',
    },
    emailInput: { 
        width: '75%',
        textAlign: 'left',
        outline: 'none',
        padding: '12px',
        borderRadius: '12px',
        border: '4px solid #DFD1F5',
        height: '350px'
    },
    instructionText: { 
        position: 'absolute', 
        width: '100%', 
        top: '15%', 
        //color: '#7a39e0', 
        fontSize: '1rem', 
        fontWeight: '400' 
    },
    instructionNoteText: { 
        position: 'absolute', 
        width: '100%', 
        top: '100%', 
        //color: '#7a39e0', 
        fontSize: '0.9rem', 
        fontWeight: '400',
        fontStyle: 'italic' 
    },
    bottomText: { 
        position: 'absolute', 
        width: '100%', 
        top: '83%', 
        //color: '#7a39e0', 
        fontSize: '18px', 
        fontWeight: '300',
        fontStyle: 'italic' 
    },
    bottomButton: { 
        position: 'absolute', 
        width: '100%', 
        top: '88%', 
        //color: '#7a39e0', 
        fontSize: '24px', 
        fontWeight: '600' 
    },
    loadingDiv: { 
        position: 'absolute', 
        height: '100%', 
        width: '100%', 
        textAlign: 'center', 
        backgroundColor: 'white',
    },
    loadingIcon: { 
        color: '#7a39e0', 
        position: 'absolute', 
        top: 'calc(50% - 51px)', 
        left: 'calc(50% + 51px)',  
        fontWeight: '600',
    },
    characterCounter: {
        position: "absolute",
        top: '80%',
        right: '17%',
        color: "gray",
        fontSize: "12px",
    },
}