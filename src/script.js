//JavaScript așteaptă ca tot documentul HTML să fie încărcat complet înainte de a executa codul JavaScript.
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM încărcat complet!");
    generareLocuri("upper-section", 1, 50, "#7E1891");
    generareLocuri("middle-section", 51, 100, "#E73879");
    generareLocuri("side-left", 101, 150, "#F26B0F");
    generareLocuri("side-right", 151, 200, "#F26B0F");
    generareLocuri("front-section", 201, 250, "#FCC737");

    const resetBtn = document.getElementById("resetBtn"); //elem html "resetBtn"
    if (resetBtn) {
        resetBtn.addEventListener("click", resetSeats);
    }
});

function generareLocuri(sectionId, start, end, color) {
    let section = document.getElementById(sectionId);
    for (let i = start; i <= end; i++) {
        let div = document.createElement("div");
        div.className = "seat"; //numele clasei
        div.id = "seat-" + i; //id-ul 
        div.textContent = i; //textul afisat pe scaun
        div.style.backgroundColor = color;
        section.appendChild(div); //adauga scaunul in sectiune
    }
}


window.startCautare = function() {
    let algoritm= document.getElementById("algoritm_cautare").value; //ia valoarea din campul de alegere a algoritmului
    console.log("Algoritm selectat:", algoritm); 

    switch (algoritm) {
        case "cautare_binara":
            cautare_binara();
            break;
        case "cautare_ternara":
            cautare_ternara();
            break;
        case "cautare_salturi":
            cautare_salturi();
            break;
        case "cautare_interpolare":
            cautare_interpolare();
            break;
        case "cautare_exponentiala":
            cautare_exponentiala();
            break;
        case "cautare_fibonacci":
            cautare_fibonacci();
            break;
        default:
            console.error(" Algoritm invalid selectat!");
    }
};



async function highlightSeat(id, status) {
    let seat = document.getElementById("seat-" + id);
    if (!seat) return;

    if (status === "searching") {
        seat.classList.add("searching");
    } else if (status === "found") {
        seat.classList.remove("searching");
        seat.classList.add("found");
    } else if (status === "eliminated") {
        seat.classList.add("eliminated");
    }

    console.log('Se verifică locul: ${id}');
    await sleep(500); 
}

async function cautare_binara() {
    const loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceti un numar valid intre 1 si 250!";
        return;
    }

    let stg = 1;
    let drt = 250;
    let pas = 1;

    while (stg <= drt) {
        const mij = Math.floor((stg + drt) / 2);
        const midSeat = document.getElementById(`seat-${mij}`);
        midSeat.classList.add("searching");
        await sleep(1000);

        if (mij === loc) {
            midSeat.classList.remove("searching");
            midSeat.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        }

        // eliminare logică
        if (loc < mij) {
            for (let i = mij; i <= drt; i++) {
                const seat = document.getElementById(`seat-${i}`);
                if (seat) seat.classList.add(`eliminated-step-${pas}`);
            }
            drt = mij - 1;
        } else {
            for (let i = stg; i <= mij; i++) {
                const seat = document.getElementById(`seat-${i}`);
                if (seat) seat.classList.add(`eliminated-step-${pas}`);
            }
            stg = mij + 1;
        }

        midSeat.classList.remove("searching");
        pas++;
        await sleep(1000);
    }

    document.getElementById("status").textContent = "Locul nu a fost găsit!";
}


async function cautare_ternara() {
    let loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceti un numar valid intre 1 si 250!";
        return;
    }

    let stg = 1, drt = 250;
    let pas = 1;

    while (stg <= drt) {
        let mij1 = stg + Math.floor((drt - stg) / 3);
        let mij2 = drt - Math.floor((drt - stg) / 3);

        let midSeat1 = document.getElementById("seat-" + mij1);
        let midSeat2 = document.getElementById("seat-" + mij2);

        midSeat1.classList.add("searching");
        midSeat2.classList.add("searching");
        await sleep(700);

        if (mij1 === loc) {
            midSeat1.classList.remove("searching", "partition");
            midSeat1.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        }
        if (mij2 === loc) {
            midSeat2.classList.remove("searching", "partition");
            midSeat2.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        }

        midSeat1.classList.remove("searching");
        midSeat2.classList.remove("searching");
        midSeat1.classList.add("partition");
        midSeat2.classList.add("partition");

        if (loc < mij1) {
            for (let i = mij1; i <= drt; i++) {
                if (i !== mij1 && i !== mij2) {
                    document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
                }
            }
            drt = mij1 - 1;
        } else if (loc > mij2) {
            for (let i = stg; i <= mij2; i++) {
                if (i !== mij1 && i !== mij2) {
                    document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
                }
            }
            stg = mij2 + 1;
        } else {
            for (let i = stg; i <= drt; i++) {
                if (i < mij1 || i > mij2) {
                    document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
                }
            }
            stg = mij1 + 1;
            drt = mij2 - 1;
        }

        pas++;
        await sleep(700);
    }

    document.getElementById("status").textContent = "Locul nu a fost găsit!";
}



async function cautare_salturi() {
    let loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceți un număr valid între 1 și 250!";
        return;
    }

    let step = Math.floor(Math.sqrt(250)); 
    let prev = 1, next = step;
    let pas = 1;

    while (next <= 250 && document.getElementById("seat-" + next)) {
        document.getElementById("seat-" + next).classList.add("partition");
        await sleep(500);

        if (loc <= next) break; 

        for (let i = prev; i < next; i++) {
            document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
        }

        pas++;
        prev = next;
        next += step;
    }

    for (let i = prev; i <= Math.min(next, 250); i++) {
        document.getElementById("seat-" + i).classList.add("searching");
        await sleep(500);

        if (i === loc) {
            document.getElementById("seat-" + i).classList.remove("searching", "partition");
            document.getElementById("seat-" + i).classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        }

        document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
    }

    document.getElementById("status").textContent = "Locul nu a fost găsit!";
}


async function cautare_interpolare() {
    let loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceti un numar valid intre 1 si 250!";
        return;
    }

    let stg = 1, drt = 250;
    let pas = 1;

    while (stg <= drt && loc >= stg && loc <= drt) {
        let pos = stg + Math.floor(((loc - stg) / (drt - stg + 1)) * (drt - stg));

        let posSeat = document.getElementById("seat-" + pos);
        posSeat.classList.add("searching");
        await sleep(500);

        if (pos === loc) {
            posSeat.classList.remove("searching");
            posSeat.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost gasit!`;
            return;
        }

        if (pos < loc) {
            for (let i = stg; i < pos; i++) {
                document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
            }
            stg = pos + 1;
        } else {
            for (let i = pos; i <= drt; i++) {
                document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
            }
            drt = pos - 1;
        }

        pas++;
        posSeat.classList.remove("searching");
        await sleep(500);
    }

    document.getElementById("status").textContent = "Locul nu a fost gasit!";
}


async function cautare_exponentiala() {
    let loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceti un numar valid intre 1 si 250!";
        return;
    }

    let pas = 1;

    // Verificăm primul loc
    if (document.getElementById("seat-1").textContent == loc) {
        await highlightSeat(1, "found");
        return;
    }

    let i = 1;
    while (i < 250 && parseInt(document.getElementById("seat-" + i).textContent) < loc) {
        await highlightSeat(i, "searching");
        await sleep(500);
        document.getElementById("seat-" + i).classList.add(`eliminated-step-${pas}`);
        i *= 2;
        pas++;
    }

    let left = Math.floor(i / 2);
    let right = Math.min(i, 250);

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midSeat = document.getElementById("seat-" + mid);
        midSeat.classList.add("searching");
        await sleep(500);

        if (mid === loc) {
            midSeat.classList.remove("searching");
            midSeat.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        } else if (mid < loc) {
            for (let j = left; j < mid; j++) {
                document.getElementById("seat-" + j).classList.add(`eliminated-step-${pas}`);
            }
            left = mid + 1;
        } else {
            for (let j = mid; j <= right; j++) {
                document.getElementById("seat-" + j).classList.add(`eliminated-step-${pas}`);
            }
            right = mid - 1;
        }

        midSeat.classList.remove("searching");
        pas++;
        await sleep(500);
    }

    document.getElementById("status").textContent = "Locul nu a fost găsit!";
}



async function cautare_fibonacci() {
    let loc = parseInt(document.getElementById("cautaLoc").value);
    if (isNaN(loc) || loc < 1 || loc > 250) {
        document.getElementById("status").textContent = "Introduceți un număr valid între 1 și 250!";
        return;
    }

    let fibM2 = 0, fibM1 = 1, fibM = fibM1 + fibM2;
    while (fibM < 250) {
        fibM2 = fibM1;
        fibM1 = fibM;
        fibM = fibM1 + fibM2;
    }

    let offset = 0;
    let pas = 1;

    while (fibM > 1) {
        let i = Math.min(offset + fibM2, 250);

        let midSeat = document.getElementById("seat-" + i);
        midSeat.classList.add("searching");
        await sleep(500);

        if (i === loc) {
            midSeat.classList.remove("searching");
            midSeat.classList.add("found");
            document.getElementById("status").textContent = `Locul ${loc} a fost găsit!`;
            return;
        }

        if (i < loc) {
            for (let j = offset + 1; j <= i; j++) {
                let eliminatedSeat = document.getElementById("seat-" + j);
                if (eliminatedSeat) eliminatedSeat.classList.add(`eliminated-step-${pas}`);
            }
            fibM = fibM1;
            fibM1 = fibM2;
            fibM2 = fibM - fibM1;
            offset = i;
        } else {
            for (let j = i; j <= offset + fibM1; j++) {
                let eliminatedSeat = document.getElementById("seat-" + j);
                if (eliminatedSeat) eliminatedSeat.classList.add(`eliminated-step-${pas}`);
            }
            fibM = fibM2;
            fibM1 -= fibM2;
            fibM2 = fibM - fibM1;
        }

        midSeat.classList.remove("searching");
        pas++;
        await sleep(500);
    }

    document.getElementById("status").textContent = "Locul nu a fost găsit!";
}





window.resetSeats = function () {
    console.log("Resetare efectuată!");

    const allSeats = document.querySelectorAll(".seat");
    allSeats.forEach(seat => {
        seat.className = "seat"; // elimină toate clasele extra
    });

    document.getElementById("cautaLoc").value = "";
    document.getElementById("status").textContent = "Alegeți un loc pentru căutare!";
    document.getElementById("checkedSeats").textContent = "Nicio căutare efectuată";
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
