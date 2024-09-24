export async function navBar(archetypes, filters)
{
    // Creamos un string con las opciones del select basado en el JSON elemento
    let options = '<option>Arquetipo</option>';
    
    archetypes.forEach(item => {
        // Verificar si el arquetipo actual está en los filtros, si lo está, lo seleccionamos
        const selected = filters.archetype === item.archetype_name ? 'selected' : '';
        options += `<option ${selected}>${item.archetype_name}</option>`;
    });

    // Verificar si los valores existen en los filtros para asignar el valor correcto o dejar el default
    const selectedType = filters.type ? filters.type : '';
    const selectedRace = filters.race ? filters.race : '';
    const enteredName = filters.fname ? filters.fname : '';

    return  `
            <div class="search-filters">
                <select id="tipo">
                    <option value="" ${!selectedType ? 'selected' : ''}>Tipo</option>
                    <option ${selectedType === 'Effect Monster' ? 'selected' : ''}>Effect Monster</option>
                    <option ${selectedType === 'Flip Effect Monster' ? 'selected' : ''}>Flip Effect Monster</option>
                    <option ${selectedType === 'Fusion Monster' ? 'selected' : ''}>Fusion Monster</option>
                    <option ${selectedType === 'Gemini Monster' ? 'selected' : ''}>Gemini Monster</option>
                    <option ${selectedType === 'Link Monster' ? 'selected' : ''}>Link Monster</option>
                    <option ${selectedType === 'Normal Monster' ? 'selected' : ''}>Normal Monster</option>
                    <option ${selectedType === 'Normal Tuner Monster' ? 'selected' : ''}>Normal Tuner Monster</option>
                    <option ${selectedType === 'Pendulum Effect Fusion Monster' ? 'selected' : ''}>Pendulum Effect Fusion Monster</option>
                    <option ${selectedType === 'Pendulum Effect Monster' ? 'selected' : ''}>Pendulum Effect Monster</option>
                    <option ${selectedType === 'Pendulum Effect Ritual Monster' ? 'selected' : ''}>Pendulum Effect Ritual Monster</option>
                    <option ${selectedType === 'Pendulum Flip Effect Monster' ? 'selected' : ''}>Pendulum Flip Effect Monster</option>
                    <option ${selectedType === 'Pendulum Normal Monster' ? 'selected' : ''}>Pendulum Normal Monster</option>
                    <option ${selectedType === 'Pendulum Tuner Effect Monster' ? 'selected' : ''}>Pendulum Tuner Effect Monster</option>
                    <option ${selectedType === 'Ritual Effect Monster' ? 'selected' : ''}>Ritual Effect Monster</option>
                    <option ${selectedType === 'Ritual Monster' ? 'selected' : ''}>Ritual Monster</option>
                    <option ${selectedType === 'Skill Card' ? 'selected' : ''}>Skill Card</option>
                    <option ${selectedType === 'Spell Card' ? 'selected' : ''}>Spell Card</option>
                    <option ${selectedType === 'Spirit Monster' ? 'selected' : ''}>Spirit Monster</option>
                    <option ${selectedType === 'Synchro Monster' ? 'selected' : ''}>Synchro Monster</option>
                    <option ${selectedType === 'Synchro Pendulum Effect Monster' ? 'selected' : ''}>Synchro Pendulum Effect Monster</option>
                    <option ${selectedType === 'Synchro Tuner Monster' ? 'selected' : ''}>Synchro Tuner Monster</option>
                    <option ${selectedType === 'Token' ? 'selected' : ''}>Token</option>
                    <option ${selectedType === 'Toon Monster' ? 'selected' : ''}>Toon Monster</option>
                    <option ${selectedType === 'Trap Card' ? 'selected' : ''}>Trap Card</option>
                    <option ${selectedType === 'Tuner Monster' ? 'selected' : ''}>Tuner Monster</option>
                    <option ${selectedType === 'Union Effect Monster' ? 'selected' : ''}>Union Effect Monster</option>
                    <option ${selectedType === 'XYZ Monster' ? 'selected' : ''}>XYZ Monster</option>
                    <option ${selectedType === 'XYZ Pendulum Effect Monster' ? 'selected' : ''}>XYZ Pendulum Effect Monster</option>
                </select>
                
                <select id="raza">
                    <option value="" ${!selectedRace ? 'selected' : ''}>Raza</option>
                    <option ${selectedRace === 'Aqua' ? 'selected' : ''}>Aqua</option>
                    <option ${selectedRace === 'Beast' ? 'selected' : ''}>Beast</option>
                    <option ${selectedRace === 'Beast-Warrior' ? 'selected' : ''}>Beast-Warrior</option>
                    <option ${selectedRace === 'Continuous' ? 'selected' : ''}>Continuous</option>
                    <option ${selectedRace === 'Counter' ? 'selected' : ''}>Counter</option>
                    <option ${selectedRace === 'Creator God' ? 'selected' : ''}>Creator God</option>
                    <option ${selectedRace === 'Cyberse' ? 'selected' : ''}>Cyberse</option>
                    <option ${selectedRace === 'Dinosaur' ? 'selected' : ''}>Dinosaur</option>
                    <option ${selectedRace === 'Divine-Beast' ? 'selected' : ''}>Divine-Beast</option>
                    <option ${selectedRace === 'Dragon' ? 'selected' : ''}>Dragon</option>
                    <option ${selectedRace === 'Equip' ? 'selected' : ''}>Equip</option>
                    <option ${selectedRace === 'Fairy' ? 'selected' : ''}>Fairy</option>
                    <option ${selectedRace === 'Field' ? 'selected' : ''}>Field</option>
                    <option ${selectedRace === 'Fiend' ? 'selected' : ''}>Fiend</option>
                    <option ${selectedRace === 'Fish' ? 'selected' : ''}>Fish</option>
                    <option ${selectedRace === 'Illusion' ? 'selected' : ''}>Illusion</option>
                    <option ${selectedRace === 'Insect' ? 'selected' : ''}>Insect</option>
                    <option ${selectedRace === 'Machine' ? 'selected' : ''}>Machine</option>
                    <option ${selectedRace === 'Normal' ? 'selected' : ''}>Normal</option>
                    <option ${selectedRace === 'Plant' ? 'selected' : ''}>Plant</option>
                    <option ${selectedRace === 'Psychic' ? 'selected' : ''}>Psychic</option>
                    <option ${selectedRace === 'Pyro' ? 'selected' : ''}>Pyro</option>
                    <option ${selectedRace === 'Quick-Play' ? 'selected' : ''}>Quick-Play</option>
                    <option ${selectedRace === 'Reptile' ? 'selected' : ''}>Reptile</option>
                    <option ${selectedRace === 'Ritual' ? 'selected' : ''}>Ritual</option>
                    <option ${selectedRace === 'Rock' ? 'selected' : ''}>Rock</option>
                    <option ${selectedRace === 'Sea Serpent' ? 'selected' : ''}>Sea Serpent</option>
                    <option ${selectedRace === 'Spellcaster' ? 'selected' : ''}>Spellcaster</option>
                    <option ${selectedRace === 'Thunder' ? 'selected' : ''}>Thunder</option>
                    <option ${selectedRace === 'Warrior' ? 'selected' : ''}>Warrior</option>
                    <option ${selectedRace === 'Winged Beast' ? 'selected' : ''}>Winged Beast</option>
                    <option ${selectedRace === 'Wyrm' ? 'selected' : ''}>Wyrm</option>
                    <option ${selectedRace === 'Zombie' ? 'selected' : ''}>Zombie</option>
                </select>

                <select id="arquetipo">
                    ${options}
                </select>
                
                <input type="text" id="nombre" placeholder="Nombre" value="${enteredName}" />
            </div>
            `;
}

