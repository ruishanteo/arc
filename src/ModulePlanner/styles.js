export const styles = {
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
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // Size
        width: '1180px',
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      
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
        fontSize: '1.5rem', 
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
    instructionContainer: {
        position: 'absolute',
        width: '100%',
        top: '18%',
        bottom: '12%',
        overflow: 'auto', // Enable vertical scrolling
      },
    instructionText: { 
        //position: 'absolute', 
        width: '100%', 
        top: '18%', 
        //color: '#7a39e0',  
        fontSize: '1rem',
        fontWeight: '400' 
    },
    instructionNoteText: { 
        position: 'absolute', 
        width: '100%', 
        top: '100%', 
        //color: '#7a39e0', 
        fontSize: '20px', 
        fontWeight: '400',
        fontStyle: 'italic' 
    },
    bottomContainer: {
        position: 'absolute',
        width: '100%',
        bottom: '5%', // Adjust as needed to leave space for the content
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        backgroundColor: 'white',
    },
    bottomText: { 
        fontSize: '0.8rem', 
        fontWeight: '300',
        fontStyle: 'italic',
        backgroundColor: 'white',
    },
    bottomButton: { 
        marginTop: '8px', // Adjust as needed to add space between the text and button
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
