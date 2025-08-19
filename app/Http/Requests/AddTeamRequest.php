<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'teamName'        => 'required|string|max:255|unique:teams,name',
            'teamLeaderID'    => 'required|string|max:255|unique:teams,team_leader_id',
            'loginID'         => 'required|string|max:255|unique:users,login_id',
            'password'        => 'required|min:8|confirmed',
        ];
    }

    public function messages()
    {
        return [
            'teamName.required'   => '请输入组别名称',
            'teamName.unique'      => '组别名称已被注册',
            'teamLeaderID.required'   => '请选择组长',
            'teamLeaderID.unique'   => '该组长已被选择',
            'loginID.required'    => '请输入登录ID',
            'loginID.unique'      => '登录ID已被注册',
            'password.required'   => '请输入密码',
            'password.min'        => '请输入至少 :min 个字符',
            'password.confirmed'  => '密码不匹配',
        ];
    }
}
