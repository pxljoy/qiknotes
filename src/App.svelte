<script>
	// import store from './main';
	import bus from './lib/bus';

	import { onMount, tick } from 'svelte';
	import autosize from './lib/autosize';

	// let list = store.get('list');
	let textarea;
	let newItemName = '';
	let store = {};

	bus.on('receive-store', (event, message) => {
		store = message;
		console.log('new store', store);
	});

	onMount(() => {
		autosize(textarea);
	});

	const addItem = (item) => {
		if (item && item.trim()) {
			console.log('adding item', item);
			setTimeout(() => {
				bus.send('update-store-key', { key: 'list', value: [{ id: new Date().valueOf(), timestamp: new Date(), content: item.trim() }, ...(store.list || [])] });
			}, 1);
		}
	}
	const handleAddItem = async (e) => {
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			e.stopPropagation();
			addItem(newItemName);
			newItemName = '';
			await tick();
			autosize.update(textarea);
		}
	}
	const submitItem = async () => {
		addItem(newItemName);
		newItemName = '';
		await tick();
		autosize.update(textarea);
	}

	const clear = () => {
		bus.send('update-store-key', { key: 'list', value: [] });
	}
	const remove = (id) => {
		bus.send('update-store-key', { key: 'list', value: store.list.filter(x => x.id !== id) });
	}
</script>

<style global lang="scss" src="./theme/index.scss"></style>

<div class="pa-4">
	<div style="width: 100%;" class="d-flex justify-center align-center px-1 pt-1">
		<h2>What's on your mind?</h2>
	</div>
	<div class="pa-1">
		<textarea
			bind:this={textarea}
			on:keypress={handleAddItem}
			bind:value={newItemName}
			style="width: 100%; resize: vertical; height: 140px;"
			class="textarea mt-4 grey ba-1--grey-2 bra-1 ba-1--grey-4--focus"
			type="text"
			autofocus
		/>

		<div class="pb-0 pt-5 d-flex justify-space-between align-center">
			{#if store.list && store.list.length}
				<h4 class="pa-0 ma-0">Notes 📓</h4>
				<div on:click={clear} style="font-size: 10px;line-height: 10px; cursor: pointer;" class="grey-2--hover py-1 px-2 bra-1">Clear</div>
			{:else}
			<div style="font-size: 14px; width: 100%; text-align: center;" class="grey-5--text">
				No notes yet...
			</div>
			{/if}
		</div>

		{#each (store.list || []) as item (item.id)}
			<br>
			<div class="list-item bra-2 ba-1--grey-2 pa-2" style="position: relative;">
				<pre class="ma-0" style="white-space: pre-wrap;word-wrap: break-word;">{item.content}</pre>
				<div on:click={() => remove(item.id)} style="position: absolute; right: 0px; top: 0px; font-size: 10px;line-height: 10px; cursor: pointer;" class="remove grey-2 py-1 px-2 bra-1">Remove</div>
			</div>
		{/each}
	</div>
</div>
