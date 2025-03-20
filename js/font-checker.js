// Font Checker Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('Font checker loaded');
    
    // Try to detect when fonts are loaded
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() {
            console.log('All fonts are loaded according to the Font Loading API');
            
            // Check if specific font is loaded
            if (document.fonts.check('1em "Proxima Nova"')) {
                console.log('✅ Proxima Nova font is loaded');
                document.body.classList.add('fonts-loaded');
            } else {
                console.error('❌ Proxima Nova font failed to load');
                logFontDetails();
            }
        }).catch(function(err) {
            console.error('Font loading error:', err);
            logFontDetails();
        });
    } else {
        console.warn('Font Loading API not supported in this browser');
        
        // Fallback method
        setTimeout(function() {
            console.log('Checking font after timeout');
            logFontDetails();
        }, 2000);
    }
    
    function logFontDetails() {
        console.log('Debugging font information:');
        console.log('- Current path:', window.location.pathname);
        console.log('- CSS font-family on body:', getComputedStyle(document.body).fontFamily);
        console.log('- CSS font-family on h4:', document.querySelector('h4') ? 
            getComputedStyle(document.querySelector('h4')).fontFamily : 'No h4 element found');
        
        // Check which font files the browser is trying to load
        const fontURLs = Array.from(document.styleSheets)
            .filter(sheet => !sheet.href || sheet.href.indexOf('google') === -1)
            .reduce((urls, sheet) => {
                try {
                    return urls.concat(
                        Array.from(sheet.cssRules || [])
                            .filter(rule => rule.type === CSSRule.FONT_FACE_RULE)
                            .map(rule => {
                                const src = rule.style.getPropertyValue('src');
                                const family = rule.style.getPropertyValue('font-family').replace(/['"]/g, '');
                                return { family, src };
                            })
                    );
                } catch (e) {
                    console.warn('Could not access cssRules from stylesheet', e);
                    return urls;
                }
            }, []);
        
        console.log('- Font face rules found:', fontURLs);
    }
}); 