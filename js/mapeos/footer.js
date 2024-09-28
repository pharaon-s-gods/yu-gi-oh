export async function footer() {
    return `
        <div class="footer-container">
            <!-- Información de contacto -->
            <div class="footer-section">
                <h4>Contacto</h4>
                <p>Email: contacto@yugiohstore.com</p>
                <p>Teléfono: +54 221 123 4567</p>
                <p>Ubicación: La Plata, Buenos Aires</p>
            </div>
    
            <!-- Redes sociales -->
            <div class="footer-section">
                <h4>Seguinos</h4>
                <a href="#">Facebook</a> | 
                <a href="#">Twitter</a> | 
                <a href="#">Instagram</a>
            </div>
    
            <!-- Políticas -->
            <div class="footer-section">
                <h4>Políticas</h4>
                <a href="#">Términos y condiciones</a><br>
                <a href="#">Política de privacidad</a><br>
                <a href="#">Devoluciones</a>
            </div>
            
            <!-- Derechos de autor -->
            <div class="footer-section">
                <p>&copy; 2024 Yu-Gi-Oh! Store. Todos los derechos reservados.</p>
            </div>
        </div>

        <!-- Banner publicitario (solo en escritorio) -->
        <div class="banner-container">
            <img src="../img/banner.jpg" alt="Publicidad Yu-Gi-Oh! Store">
        </div>
    `;
}
