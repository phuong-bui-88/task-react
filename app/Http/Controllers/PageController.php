<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = Page::all();
        return PageResource::collection($pages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        return new PageResource($page);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PageRequest $request, Page $page)
    {
        $page->update($request->validated());

        return new PageResource($page);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function welcome()
    {
        $page = Page::find(1);

        return new PageResource($page);
    }

    public function consulation()
    {
        $page = Page::find(2);

        return new PageResource($page);
    }
}
