document.addEventListener("DOMContentLoaded", () => {
	let entryList;
	entryList = JSON.parse(localStorage.getItem("ENTRY_LIST")) || [];

	const balance = document.querySelector(".balance");

	const incomeTitle = document.getElementById("incomeTitle");
	const incomeValue = document.getElementById("incomeValue");
	const submitIncome = document.querySelector(".income-btn");
	const totalIncome = document.querySelector(".totalIncome");
	const incomeTransaction = document.querySelector(".incomeTransaction");

	const expenseTitle = document.getElementById("expenseTitle");
	const expenseValue = document.getElementById("expenseValue");
	const submitExpense = document.querySelector(".expense-btn");
	const totalExpense = document.querySelector(".totalExpense");
	const expenseTransaction = document.querySelector(".expenseTransaction");

	submitIncome.addEventListener("click", incomeSubmit);
	submitExpense.addEventListener("click", expenseSubmit);

	incomeTransaction.addEventListener("click", deleteEntry);
	expenseTransaction.addEventListener("click", deleteEntry);

	//Chart
	const chartBalance = document.querySelector(".chart");
	const canvas = document.createElement("canvas");
	canvas.width = 300;
	canvas.height = 300;
	chartBalance.appendChild(canvas);
	const ctx = canvas.getContext("2d");
	const R = 140;

	updateUI();

	function drawCircle(color, ratio, anticlockwise) {
		ctx.strokeStyle = color;
		ctx.lineWidth = 20;
		ctx.beginPath();
		ctx.arc(
			canvas.width / 2,
			canvas.height / 2,
			R,
			0,
			ratio * 2 * Math.PI,
			anticlockwise
		);
		ctx.stroke();
	}

	function updateChart(income, expense) {
		ctx.clearRect(0, 0, ctx.width, ctx.height);
		let ratio = expense / income;

		if (income === expense) {
			drawCircle("#fff", 1, false);
		} else if (expense > income) {
			drawCircle("#ee6d3a", 1, false);
		} else {
			drawCircle("#a5e1ad", -(1 - ratio), true);
			drawCircle("#ee6d3a", ratio, false);
		}
	}

	function incomeSubmit() {
		if (incomeTitle.value === "" || incomeValue.value === "") {
			alert("Please enter income title/value");
		} else {
			let income = {
				type: "income",
				title: incomeTitle.value,
				amount: parseFloat(incomeValue.value),
			};
			entryList.push(income);
			updateUI();
			clearInput([incomeTitle, incomeValue]);
		}
	}

	function expenseSubmit() {
		if (expenseTitle.value === "" || expenseValue.value === "") {
			alert("Please enter expense title/value");
		} else {
			let expense = {
				type: "expense",
				title: expenseTitle.value,
				amount: parseFloat(expenseValue.value),
			};
			entryList.push(expense);
			updateUI();
			clearInput([expenseTitle, expenseValue]);
		}
	}

	function calculateTotal(type, entryList) {
		let sum = 0;

		entryList.forEach((entry) => {
			if (entry.type == type) {
				sum += entry.amount;
			}
		});

		return sum;
	}

	function clearInput(input) {
		input.forEach((result) => {
			result.value = "";
		});
	}

	function clearElement(element) {
		element.forEach((result) => {
			result.innerHTML = "";
		});
	}

	function updateUI() {
		let totalBalance = 0;
		const incomeBalance = calculateTotal("income", entryList);
		const expenseBalance = calculateTotal("expense", entryList);

		totalBalance = Math.abs(incomeBalance - expenseBalance);

		let sign = incomeBalance >= expenseBalance ? "RM" : "-RM";

		balance.innerHTML = `${sign} ${totalBalance}`;
		totalIncome.innerHTML = `${incomeBalance}`;
		totalExpense.innerHTML = `${expenseBalance}`;

		clearElement([incomeTransaction, expenseTransaction]);

		entryList.forEach((entry, index) => {
			if (entry.type == "income") {
				showEntry(incomeTransaction, entry.title, entry.amount, index);
			} else if (entry.type == "expense") {
				showEntry(expenseTransaction, entry.title, entry.amount, index);
			}
		});

		updateChart(incomeBalance, expenseBalance);

		localStorage.setItem("ENTRY_LIST", JSON.stringify(entryList));
	}

	function showEntry(list, title, amount, id) {
		const entry = `<li id="${id}">
        <div>${title} : RM ${amount}</div>
        <img id="delete" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMnB0IiB2aWV3Qm94PSItNjQgMCA1MTIgNTEyIiB3aWR0aD0iNTEycHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTI1NiA4MGgtMzJ2LTQ4aC02NHY0OGgtMzJ2LTgwaDEyOHptMCAwIiBmaWxsPSIjNjI4MDhjIi8+PHBhdGggZD0ibTMwNCA1MTJoLTIyNGMtMjYuNTA3ODEyIDAtNDgtMjEuNDkyMTg4LTQ4LTQ4di0zMzZoMzIwdjMzNmMwIDI2LjUwNzgxMi0yMS40OTIxODggNDgtNDggNDh6bTAgMCIgZmlsbD0iI2U3NmU1NCIvPjxwYXRoIGQ9Im0zODQgMTYwaC0zODR2LTY0YzAtMTcuNjcxODc1IDE0LjMyODEyNS0zMiAzMi0zMmgzMjBjMTcuNjcxODc1IDAgMzIgMTQuMzI4MTI1IDMyIDMyem0wIDAiIGZpbGw9IiM3Nzk1OWUiLz48cGF0aCBkPSJtMjYwIDI2MGMtNi4yNDYwOTQtNi4yNDYwOTQtMTYuMzc1LTYuMjQ2MDk0LTIyLjYyNSAwbC00MS4zNzUgNDEuMzc1LTQxLjM3NS00MS4zNzVjLTYuMjUtNi4yNDYwOTQtMTYuMzc4OTA2LTYuMjQ2MDk0LTIyLjYyNSAwcy02LjI0NjA5NCAxNi4zNzUgMCAyMi42MjVsNDEuMzc1IDQxLjM3NS00MS4zNzUgNDEuMzc1Yy02LjI0NjA5NCA2LjI1LTYuMjQ2MDk0IDE2LjM3ODkwNiAwIDIyLjYyNXMxNi4zNzUgNi4yNDYwOTQgMjIuNjI1IDBsNDEuMzc1LTQxLjM3NSA0MS4zNzUgNDEuMzc1YzYuMjUgNi4yNDYwOTQgMTYuMzc4OTA2IDYuMjQ2MDk0IDIyLjYyNSAwczYuMjQ2MDk0LTE2LjM3NSAwLTIyLjYyNWwtNDEuMzc1LTQxLjM3NSA0MS4zNzUtNDEuMzc1YzYuMjQ2MDk0LTYuMjUgNi4yNDYwOTQtMTYuMzc4OTA2IDAtMjIuNjI1em0wIDAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" />
        </li>`;

		list.insertAdjacentHTML("afterbegin", entry);
	}

	function deleteEntry(event) {
		const entry = event.target.parentNode;

		if (event.target.id == "delete") {
			entryList.splice(entry.id, 1);
		}

		updateUI();
	}
});
